from django.contrib import admin

from .models import Order, OrderItem, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("line_total",)


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "guest_name", "guest_phone", "status", "total", "created_at")
    list_filter = ("status",)
    search_fields = ("order_number", "guest_name", "guest_phone")
    readonly_fields = ("order_number", "created_at")
    inlines = [OrderItemInline, PaymentInline]
