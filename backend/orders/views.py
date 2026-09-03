import logging

from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer
from .services import InsufficientStockError, confirm_payment_and_reserve_stock, create_order

logger = logging.getLogger(__name__)


class OrderCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = create_order(
            guest_name=data["guest_name"],
            guest_phone=data["guest_phone"],
            guest_email=data.get("guest_email", ""),
            delivery_address=data.get("delivery_address", ""),
            items=data["items"],
        )

        # TODO once CamPay credentials exist: initiate the actual payment
        # request here and return the payment link/USSD prompt to the client.
        # from .campay_client import initiate_payment
        # initiate_payment(order)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderLookupView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = "order_number"
    permission_classes = [AllowAny]


class CamPayWebhookView(APIView):
    """
    CamPay calls this endpoint when a payment succeeds or fails.
    IMPORTANT: signature verification below is a placeholder — replace
    with CamPay's actual webhook signing scheme before going live.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.data
        reference = payload.get("reference")
        order_number = payload.get("external_reference")
        payment_status = payload.get("status")

        if not self._verify_signature(request):
            return Response({"detail": "invalid signature"}, status=status.HTTP_403_FORBIDDEN)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            logger.warning("CamPay webhook for unknown order %s", order_number)
            return Response(status=status.HTTP_404_NOT_FOUND)

        if payment_status == "SUCCESSFUL":
            try:
                confirm_payment_and_reserve_stock(order, campay_reference=reference)
            except InsufficientStockError:
                logger.error("Stock conflict on order %s after payment", order_number)
                order.status = "cancelled"
                order.save(update_fields=["status"])
                # TODO: trigger a refund via CamPay + notify the customer
        else:
            order.payment.status = "failed"
            order.payment.save(update_fields=["status"])

        return Response(status=status.HTTP_200_OK)

    def _verify_signature(self, request):
        # Placeholder — implement against CamPay's actual webhook secret/signing header.
        return True
