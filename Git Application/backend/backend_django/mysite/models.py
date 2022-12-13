from django.db import models
from django.conf import settings
from django.utils import timezone


class Article(models.Model):

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)
    image_url = models.CharField(max_length=200)

class Product(models.Model):

    title = models.CharField(max_length=200)
    image_url = models.CharField(max_length=200)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)    
