from rest_framework import serializers

from .models import Booking


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "guest_name", "guest_phone", "guest_email", "service_type",
            "project_address", "notes", "catalog_item", "slot_start", "slot_end",
        ]

    def validate(self, data):
        if data["slot_end"] <= data["slot_start"]:
            raise serializers.ValidationError("slot_end must be after slot_start.")
        return data


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id", "guest_name", "service_type", "project_address",
            "slot_start", "slot_end", "status", "created_at",
        ]
