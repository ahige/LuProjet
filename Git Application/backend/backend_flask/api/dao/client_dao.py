from .abstract_dao import AbstractDao
from .models import Client

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class ClientDao(AbstractDao):

    def __init__(self):
        AbstractDao.__init__(self, Client)