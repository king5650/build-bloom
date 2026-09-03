from django.contrib import admin

from .models import AvailabilityWindow, Booking


@admin.register(AvailabilityWindow)
class AvailabilityWindowAdmin(admin.ModelAdmin):
    list_display = ("day_of_week", "start_time", "end_time")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("guest_name", "guest_phone", "service_type", "slot_start", "status")
    list_filter = ("status", "service_type")
    search_fields = ("guest_name", "guest_phone")
    list_editable = ("status",)
