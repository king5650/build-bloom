import logging

from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer
from .services import (
    InsufficientStockError,
    confirm_payment_and_reserve_stock,
    create_order,
    get_payment_status,
    initiate_payment,
)

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
            channel=data["channel"],
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

    def get_object(self):
        order = super().get_object()
        phone = self.request.query_params.get("phone")
        if phone and order.guest_phone.replace(" ", "") != phone.replace(" ", ""):
            from rest_framework.exceptions import NotFound
            raise NotFound()
        return order


class PaymentInitiateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, status="pending")
            result = initiate_payment(order)
        except Order.DoesNotExist:
            return Response({"detail": "Order is not available for payment."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as error:
            logger.exception("CamPay initiation failed for %s", order_number)
            return Response({"detail": str(error)}, status=status.HTTP_502_BAD_GATEWAY)
        return Response(result)


class PaymentStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, order_number):
        try:
            order = Order.objects.select_related("payment").get(order_number=order_number)
            payment_status, _operator = get_payment_status(order)
            if payment_status == "SUCCESSFUL" and order.status != "paid":
                confirm_payment_and_reserve_stock(order, order.payment.campay_reference)
            elif payment_status in {"FAILED", "CANCELLED"}:
                order.status = "cancelled"
                order.save(update_fields=["status"])
                order.payment.status = "failed"
                order.payment.save(update_fields=["status"])
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except InsufficientStockError as error:
            return Response({"detail": str(error)}, status=status.HTTP_409_CONFLICT)
        except Exception as error:
            logger.exception("CamPay status check failed for %s", order_number)
            return Response({"detail": str(error)}, status=status.HTTP_502_BAD_GATEWAY)
        order.refresh_from_db()
        return Response(OrderSerializer(order).data)


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
