from django.urls import path

from .views import CamPayWebhookView, OrderCreateView, OrderLookupView, PaymentInitiateView, PaymentStatusView

urlpatterns = [
    path("", OrderCreateView.as_view(), name="order-create"),
    path("<str:order_number>/", OrderLookupView.as_view(), name="order-lookup"),
    path("<str:order_number>/payment/", PaymentInitiateView.as_view(), name="payment-initiate"),
    path("<str:order_number>/payment/status/", PaymentStatusView.as_view(), name="payment-status"),
]

payment_urlpatterns = [
    path("campay/webhook/", CamPayWebhookView.as_view(), name="campay-webhook"),
]
