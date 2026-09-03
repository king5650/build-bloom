from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email_or_phone", "status", "created_at")
    list_filter = ("status",)
    list_editable = ("status",)
    search_fields = ("name", "email_or_phone", "message")
