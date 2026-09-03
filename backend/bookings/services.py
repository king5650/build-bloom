"""
Booking creation logic, isolated from views.py.

Concurrency approach: two people could try to book the exact same slot
at the same moment. To make that safe without relying on a Postgres-only
exclusion constraint, we serialize booking-creation for a given day using
a per-day lock row (DayLock), locked with select_for_update inside a
transaction. This makes the whole "check overlap, then create" sequence
atomic with respect to other requests for that same day.
"""
from django.db import transaction

from .models import Booking, DayLock


class SlotUnavailableError(Exception):
    pass


def create_booking(*, slot_start, slot_end, **booking_fields):
    day = slot_start.date()

    with transaction.atomic():
        lock, _ = DayLock.objects.get_or_create(date=day)
        DayLock.objects.select_for_update().get(pk=lock.pk)  # blocks concurrent requests for this day

        overlapping = Booking.objects.filter(
            slot_start__lt=slot_end,
            slot_end__gt=slot_start,
            status__in=["requested", "confirmed"],
        ).exists()

        if overlapping:
            raise SlotUnavailableError("This time slot is no longer available.")

        booking = Booking.objects.create(slot_start=slot_start, slot_end=slot_end, **booking_fields)

    return booking


def get_available_slots(date, slot_duration_minutes=90):
    """
    Given a date, returns candidate slot start times based on AvailabilityWindow
    for that weekday, minus any slots that overlap an existing booking.
    """
    from datetime import datetime, timedelta

    from .models import AvailabilityWindow

    windows = AvailabilityWindow.objects.filter(day_of_week=date.weekday())
    existing = list(
        Booking.objects.filter(slot_start__date=date, status__in=["requested", "confirmed"])
    )

    slots = []
    for window in windows:
        current = datetime.combine(date, window.start_time)
        end_of_window = datetime.combine(date, window.end_time)
        while current + timedelta(minutes=slot_duration_minutes) <= end_of_window:
            slot_end = current + timedelta(minutes=slot_duration_minutes)
            is_taken = any(b.slot_start.time() < slot_end.time() and b.slot_end.time() > current.time() for b in existing)
            if not is_taken:
                slots.append(current.time())
            current = slot_end

    return slots
