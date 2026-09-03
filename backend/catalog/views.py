from rest_framework import generics

from .models import CatalogItem
from .serializers import CatalogItemSerializer


class CatalogItemListView(generics.ListAPIView):
    serializer_class = CatalogItemSerializer

    def get_queryset(self):
        qs = CatalogItem.objects.filter(is_available=True)
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class CatalogItemDetailView(generics.RetrieveAPIView):
    queryset = CatalogItem.objects.all()
    serializer_class = CatalogItemSerializer
