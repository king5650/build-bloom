from django.urls import path

from .views import AvailabilityView, BookingCreateView

urlpatterns = [
    path("", BookingCreateView.as_view(), name="booking-create"),
    path("availability/", AvailabilityView.as_view(), name="booking-availability"),
]
