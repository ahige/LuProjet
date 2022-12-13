from django.urls import path

from . import views

urlpatterns = [
    path('index', views.index),
    path('add', views.add_produit),
    path('all', views.list_produits),
    path('formulaire', views.formulaire),
    path('contact', views.contact)
]
