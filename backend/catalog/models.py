from django.db import models


class CatalogItem(models.Model):
    name_fr = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="catalog/", blank=True, null=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "name_en"]

    def __str__(self):
        return self.name_en
