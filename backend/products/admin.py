from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name_en", "sku", "category", "price", "stock_quantity", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name_en", "name_fr", "sku")
    list_editable = ("stock_quantity", "is_active")
