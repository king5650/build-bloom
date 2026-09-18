import hashlib
import hmac
import json

from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from products.models import Product

from .models import Order
from .services import confirm_payment_and_reserve_stock, create_order


class OrderFlowTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.product = Product.objects.create(
			sku="test-product",
			name_fr="Produit test",
			name_en="Test product",
			category="Test",
			price=1000,
			stock_quantity=1,
		)

	def test_order_rejects_quantity_above_stock(self):
		response = self.client.post(
			"/api/orders/",
			{
				"guest_name": "Test customer",
				"guest_phone": "237600000000",
				"items": [{"product_id": self.product.id, "quantity": 2}],
			},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.assertEqual(Order.objects.count(), 0)

	def test_payment_confirmation_is_idempotent(self):
		order = create_order(
			guest_name="Test customer",
			guest_phone="237600000000",
			guest_email="",
			delivery_address="",
			channel="mobile_money",
			items=[{"product_id": self.product.id, "quantity": 1}],
		)

		confirm_payment_and_reserve_stock(order, "payment-1")
		confirm_payment_and_reserve_stock(order, "payment-1")

		self.product.refresh_from_db()
		order.refresh_from_db()
		self.assertEqual(self.product.stock_quantity, 0)
		self.assertEqual(order.status, "paid")

	@override_settings(CAMPAY_WEBHOOK_SECRET="test-webhook-secret")
	def test_webhook_rejects_invalid_signature(self):
		body = json.dumps({
			"external_reference": "unknown",
			"status": "SUCCESSFUL",
		}).encode()
		signature = hmac.new(
			b"wrong-secret", body, hashlib.sha256
		).hexdigest()

		response = self.client.post(
			"/api/payments/campay/webhook/",
			body,
			content_type="application/json",
			HTTP_X_CAMPAY_SIGNATURE=signature,
		)

		self.assertEqual(response.status_code, 403)
