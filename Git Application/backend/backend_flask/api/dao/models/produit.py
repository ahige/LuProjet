from sqlalchemy import Column, Integer, String, Float
from .base import Base

class Produit(Base):
    __tablename__ = 'produit'

    id = Column(Integer, autoincrement=True, primary_key=True)
    nom = Column(String(255))
    image = Column(String(255))
    qty = Column(Integer)
    prix = Column(Float)   