import pytest

from functions import *

####################### Start Fixture 1 (Function) #######################

@pytest.fixture(scope="function", params=["pops"])
def my_fixture_greeting(request):
    return greeting(request.param)

def test_greeting():
    assert greeting("moms") == "Hello moms!" 

def test_greeting_fixture1(my_fixture_greeting):
    assert my_fixture_greeting == "Hello pops!" 

####################### End Fixture 1 (Function) #######################

####################### Start Fixture 2 with parametrize (Function) #######################

@pytest.mark.parametrize(
    "param, value_obtenue", [
    #(objet à utiliser, valeurs attendues)
    ("moms", "Hello moms!"),
    ("pops", "Hello pops!"),
    ("tata", "Hello tata!")
])
def test_greeting_fixture2(param, value_obtenue):
    assert greeting(param) == value_obtenue

####################### End Fixture 2 with parametrize (Function) #######################


####################### Start Fixture 1 (Object) #######################
@pytest.fixture(scope="function", params=[Personne(nom="Doe", prenom="John", age=20)])
def my_fixture_personne(request):
    return request.param

def test_personne_constructor_fixture1(my_fixture_personne):
    assert my_fixture_personne.nom == "Doe" 
    assert my_fixture_personne.prenom == "John" 
    assert my_fixture_personne.age == 20 


def test_personne_grandir_fixture1(my_fixture_personne):
    my_fixture_personne.grandir()  
    assert my_fixture_personne.age == 21 
    
####################### End Fixture 1 (Object) #######################



####################### Start Fixture 2 with parametrize (Object) #######################

@pytest.mark.parametrize(
    "personne, tabValeurs", [
    #(objet à utiliser, valeurs attendues)
    (Personne(nom="Doe", prenom="John", age=20), ["Doe", "John", 20]),
    (Personne(nom="Martin", prenom="Jules", age=35), ["Martin", "Jules", 35]),
    (Personne(nom="Dupont", prenom="Marie", age=62), ["Dupont", "Marie", 62])
])
def test_personne_constructor_fixture2(personne, tabValeurs):
    assert personne.nom == tabValeurs[0] 
    assert personne.prenom == tabValeurs[1] 
    assert personne.age == tabValeurs[2] 


@pytest.mark.parametrize(
    "personne, age_attendu", [
    #(objet à utiliser, valeurs attendues)
    (Personne(nom="Doe", prenom="John", age=20), 21),
    (Personne(nom="Martin", prenom="Jules", age=35), 36),
    (Personne(nom="Dupont", prenom="Marie", age=62), 63)
])
def test_personne_grandir_fixture2(personne, age_attendu):
    personne.grandir()  
    assert personne.age == age_attendu

####################### End Fixture 2 with parametrize (Object) #######################
