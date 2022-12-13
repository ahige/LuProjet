from ..dao import ClientDao
from .abstract_service import AbstractService

class ClientService(AbstractService):

    def __init__(self):
        AbstractService.__init__(self, ClientDao)