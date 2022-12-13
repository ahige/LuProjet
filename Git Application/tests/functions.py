

def greeting(name):
    return 'Hello ' +  name + '!'


class Personne:

    def __init__(self, nom, prenom, age):
        self.nom = nom
        self.prenom = prenom
        self.age = age

    def grandir(self):
        self.age = self.age + 1


    