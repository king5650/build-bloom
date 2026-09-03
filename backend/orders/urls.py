from django.urls import path

from .views import CamPayWebhookView, OrderCreateView, OrderLookupView

urlpatterns = [
    path("", OrderCreateView.as_view(), name="order-create"),
    path("<str:order_number>/", OrderLookupView.as_view(), name="order-lookup"),
]

payment_urlpatterns = [
    path("campay/webhook/", CamPayWebhookView.as_view(), name="campay-webhook"),
]
