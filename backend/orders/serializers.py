from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem, Payment


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    guest_name = serializers.CharField(max_length=150)
    guest_phone = serializers.CharField(max_length=30)
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    delivery_address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    items = OrderItemInputSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Cart is empty.")
        product_ids = [i["product_id"] for i in items]
        products = Product.objects.filter(id__in=product_ids, is_active=True)
        if products.count() != len(set(product_ids)):
            raise serializers.ValidationError("One or more products are unavailable.")
        return items


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name_en", read_only=True)
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ["product", "product_name", "quantity", "unit_price", "line_total"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["status", "amount", "campay_reference"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_number", "guest_name", "guest_phone", "guest_email",
            "delivery_address", "status", "total", "created_at", "items", "payment",
        ]
