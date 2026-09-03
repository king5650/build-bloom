from datetime import datetime

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BookingCreateSerializer, BookingSerializer
from .services import SlotUnavailableError, create_booking, get_available_slots


class AvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"detail": "date query param is required (YYYY-MM-DD)."}, status=400)
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format."}, status=400)

        slots = get_available_slots(date)
        return Response({"date": date_str, "available_times": [s.strftime("%H:%M") for s in slots]})


class BookingCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            booking = create_booking(**data)
        except SlotUnavailableError as e:
            return Response({"detail": str(e)}, status=status.HTTP_409_CONFLICT)

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
