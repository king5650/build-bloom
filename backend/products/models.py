from django.db import models


class Product(models.Model):
    name_fr = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=0)  # XAF has no cents
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    photo = models.ImageField(upload_to="products/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "name_en"]

    def __str__(self):
        return f"{self.name_en} ({self.sku})"

    @property
    def in_stock(self):
        return self.stock_quantity > 0
