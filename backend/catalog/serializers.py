from rest_framework import serializers

from .models import CatalogItem


class CatalogItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogItem
        fields = [
            "id", "name_fr", "name_en", "description_fr", "description_en",
            "category", "photo", "is_available",
        ]
