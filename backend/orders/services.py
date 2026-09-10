"""
Business logic for orders, kept out of views.py so it stays testable
and reusable (e.g. from the admin, a management command, or the webhook).
"""
from django.db import transaction
from django.conf import settings
import requests

from products.models import Product

from .models import Order, OrderItem, Payment


def _campay_base_url():
    return "https://www.campay.net" if settings.CAMPAY_ENV == "live" else "https://demo.campay.net"


def _campay_token():
    response = requests.post(
        f"{_campay_base_url()}/api/token/",
        json={
            "username": settings.CAMPAY_APP_USERNAME,
            "password": settings.CAMPAY_APP_PASSWORD,
        },
        timeout=15,
    )
    response.raise_for_status()
    token = response.json().get("token")
    if not token:
        raise RuntimeError("CamPay returned no token")
    return token


def initiate_payment(order):
    token = _campay_token()
    response = requests.post(
        f"{_campay_base_url()}/api/collect/",
        headers={"Authorization": f"Token {token}"},
        json={
            "amount": str(order.total),
            "currency": "XAF",
            "from": order.guest_phone,
            "description": f"A.S Africa order {order.order_number}",
            "external_reference": order.order_number,
        },
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    reference = data.get("reference")
    if not reference:
        raise RuntimeError("CamPay returned no payment reference")
    payment = order.payment
    payment.campay_reference = reference
    payment.save(update_fields=["campay_reference"])
    return {
        "reference": reference,
        "ussd_code": data.get("ussd_code"),
        "operator": data.get("operator"),
    }


def get_payment_status(order):
    if not order.payment.campay_reference:
        return "PENDING", None
    token = _campay_token()
    response = requests.get(
        f"{_campay_base_url()}/api/transaction/{order.payment.campay_reference}/",
        headers={"Authorization": f"Token {token}"},
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("status", "PENDING").upper(), data.get("operator")


def create_order(*, guest_name, guest_phone, guest_email, delivery_address, channel, items):
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
            channel=channel,
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
