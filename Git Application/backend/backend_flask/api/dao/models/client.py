from sqlalchemy import Column, Integer, String, Float
from .base import Base

class Client(Base):
    __tablename__ = 'client'

    id = Column(Integer, autoincrement=True, primary_key=True)
    login = Column(String(150))
    password = Column(String(150))
    role = Column(String(50)) 
    nom = Column(String(150))
    prenom = Column(String(150))
    adresse = Column(String(250))
    phone = Column(String(25))
    email = Column(String(150))
