from .abstract_dao import AbstractDao
from .models import Produit

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class ProduitDao(AbstractDao):

    def __init__(self):
        AbstractDao.__init__(self, Produit)