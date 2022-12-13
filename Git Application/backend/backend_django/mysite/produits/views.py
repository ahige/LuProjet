from django.http import HttpResponse

from ..models import Product

from django import forms

class FormAddProduct(forms.Form):
    title = forms.CharField(max_length=200)
    image_url = forms.URLField()
    qty = forms.IntegerField()
    price = forms.DecimalField(max_digits=10, decimal_places=2)    


from django.shortcuts import render

def index(request):
    return HttpResponse('Hello World !')

def contact(request):
    return HttpResponse('Voici mon contact !')    

def formulaire(request):
    return render(request, 'produits/formulaire.html', {})

def list_produits(request):
    produits = Product.objects.all()
    return render(request, 'produits/produits.html', 
            {'title': "Liste des produits", 'produits': produits})

def add_produit(request):
    if request.method == "POST":
        form = FormAddProduct(request.POST)
        if form.is_valid():
            Product.objects.create(
                title = request.POST['title'],
                image_url = request.POST['image_url'],
                price = request.POST['price'],
                qty = request.POST['qty']            
            )
        return render(request, "produits/formulaire_automatic.html", {'form': form})
    elif request.method == "GET":
        form = FormAddProduct(None)
        return render(request, "produits/formulaire_automatic.html", {'form': form})
    else:
        return HttpResponse('Bad request !')

