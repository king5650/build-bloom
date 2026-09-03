from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id", "sku", "name_fr", "name_en", "description_fr", "description_en",
            "category", "price", "stock_quantity", "in_stock", "photo",
        ]
