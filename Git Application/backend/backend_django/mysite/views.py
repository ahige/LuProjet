from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return HttpResponse('Hello World INDEX !')

def apropos(request):
    return HttpResponse('A propos INDEX !')    


def formulaire(request):
    return render(request, 'formulaire.html', {})
