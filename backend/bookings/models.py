from django.db import models

from catalog.models import CatalogItem


class AvailabilityWindow(models.Model):
    DAY_CHOICES = [
        (0, "Monday"), (1, "Tuesday"), (2, "Wednesday"), (3, "Thursday"),
        (4, "Friday"), (5, "Saturday"), (6, "Sunday"),
    ]

    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ["day_of_week", "start_time"]

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    guest_name = models.CharField(max_length=150)
    guest_phone = models.CharField(max_length=30)
    guest_email = models.EmailField(blank=True)
    service_type = models.CharField(max_length=100)
    project_address = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    catalog_item = models.ForeignKey(
        CatalogItem, null=True, blank=True, on_delete=models.SET_NULL,
        help_text="Set if the client booked from a specific catalog item page",
    )
    slot_start = models.DateTimeField()
    slot_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["slot_start"]
        indexes = [models.Index(fields=["slot_start", "slot_end"])]

    def __str__(self):
        return f"{self.guest_name} - {self.slot_start:%Y-%m-%d %H:%M}"


class DayLock(models.Model):
    """
    One row per calendar date, used purely as a lock target (via
    select_for_update) so two simultaneous booking requests for the
    same day can't both pass the overlap check before either commits.
    Not shown anywhere in the admin or API — internal concurrency tool.
    """
    date = models.DateField(unique=True)

    def __str__(self):
        return str(self.date)
