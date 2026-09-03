from django.urls import path

from .views import CatalogItemDetailView, CatalogItemListView

urlpatterns = [
    path("", CatalogItemListView.as_view(), name="catalog-list"),
    path("<int:pk>/", CatalogItemDetailView.as_view(), name="catalog-detail"),
]
