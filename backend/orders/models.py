import uuid

from django.db import models

from products.models import Product


def generate_order_number():
    return uuid.uuid4().hex[:10].upper()


class Order(models.Model):
    CHANNEL_CHOICES = [
        ("mobile_money", "Mobile Money"),
        ("whatsapp", "WhatsApp"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending payment"),
        ("paid", "Paid"),
        ("fulfilled", "Fulfilled"),
        ("cancelled", "Cancelled"),
    ]

    order_number = models.CharField(max_length=10, unique=True, default=generate_order_number)
    guest_name = models.CharField(max_length=150)
    guest_phone = models.CharField(max_length=30)
    guest_email = models.EmailField(blank=True)
    delivery_address = models.CharField(max_length=255, blank=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="mobile_money")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_number} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=0)

    def __str__(self):
        return f"{self.quantity} x {self.product.name_en}"

    @property
    def line_total(self):
        if self.quantity is None or self.unit_price is None:
            return 0
        return self.quantity * self.unit_price


class Payment(models.Model):
    STATUS_CHOICES = [
        ("initiated", "Initiated"),
        ("successful", "Successful"),
        ("failed", "Failed"),
    ]

    order = models.OneToOneField(Order, related_name="payment", on_delete=models.CASCADE)
    campay_reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="initiated")
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    webhook_received_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for {self.order.order_number} - {self.status}"
