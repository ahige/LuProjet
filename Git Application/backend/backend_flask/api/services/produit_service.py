from ..dao import ProduitDao
from .abstract_service import AbstractService

class ProduitService(AbstractService):

    def __init__(self):
        AbstractService.__init__(self, ProduitDao)