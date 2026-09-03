"""
Business logic for orders, kept out of views.py so it stays testable
and reusable (e.g. from the admin, a management command, or the webhook).
"""
from django.db import transaction

from products.models import Product

from .models import Order, OrderItem, Payment


def create_order(*, guest_name, guest_phone, guest_email, delivery_address, items):
    """
    Creates an Order + OrderItems + a pending Payment.
    Does NOT touch stock yet — stock is only reserved/decremented once
    payment is actually confirmed via the CamPay webhook. This avoids
    "reserving" stock for carts that never complete checkout.
    """
    with transaction.atomic():
        order = Order.objects.create(
            guest_name=guest_name,
            guest_phone=guest_phone,
            guest_email=guest_email or "",
            delivery_address=delivery_address or "",
        )

        total = 0
        for item in items:
            product = Product.objects.get(id=item["product_id"], is_active=True)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                unit_price=product.price,
            )
            total += product.price * item["quantity"]

        order.total = total
        order.save(update_fields=["total"])

        Payment.objects.create(order=order, amount=total, status="initiated")

    return order


class InsufficientStockError(Exception):
    pass


def confirm_payment_and_reserve_stock(order: Order, campay_reference: str):
    """
    Called from the CamPay webhook once payment is verified as successful.
    Locks each product row (select_for_update) so two simultaneous webhook
    calls can never both decrement stock past zero, then decrements stock
    and marks the order paid, all inside one transaction.
    """
    with transaction.atomic():
        for item in order.items.select_related("product"):
            product = Product.objects.select_for_update().get(id=item.product_id)
            if product.stock_quantity < item.quantity:
                raise InsufficientStockError(
                    f"Not enough stock for {product.name_en} to fulfill order {order.order_number}"
                )
            product.stock_quantity -= item.quantity
            product.save(update_fields=["stock_quantity"])

        order.status = "paid"
        order.save(update_fields=["status"])

        payment = order.payment
        payment.status = "successful"
        payment.campay_reference = campay_reference
        from django.utils import timezone
        payment.webhook_received_at = timezone.now()
        payment.save(update_fields=["status", "campay_reference", "webhook_received_at"])

    return order
