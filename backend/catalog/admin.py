from django.contrib import admin

from .models import CatalogItem


@admin.register(CatalogItem)
class CatalogItemAdmin(admin.ModelAdmin):
    list_display = ("name_en", "category", "is_available")
    list_filter = ("category", "is_available")
    search_fields = ("name_en", "name_fr")
