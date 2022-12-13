from .db_utils import getDB
import hashlib

#Plein de code sur SQLAlchemy
#http://www.mapfish.org/doc/tutorials/sqlalchemy.html

class AbstractDao:

    def __init__(self, entity_class):
        self.mydb = getDB()    
        self.session = self.mydb.session
        self.entity_class = entity_class
    
    #Useful Method
    def queryBy(self, **kwargs):
        return self.session.query(self.entity_class).filter_by(**kwargs)

    ####################################
    # Count
    ####################################
    def count(self):
        return self.countBy()

    def countBy(self, **kwargs):
        return self.queryBy(**kwargs).count()

    ####################################
    # Find
    ####################################
    
    def findAll(self):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        return self.findAllBy()

    def findOneById(self, id):
        return self.findOneBy(id=id)

    def findAllBy(self, **kwargs):
        entities = []
        try:
            entities = self.queryBy(**kwargs).all()
        except:
            pass
        return entities

    def findOneBy(self, **kwargs):
        entity = None
        try:
            entity = self.queryBy(**kwargs).first()
        except:
            pass
        return entity
                
    ####################################
    # Create
    ####################################
    
    def create(self, **kwargs):
        #https://code-maven.com/slides/python-programming/orm-select-insert
        try:
            self.session.add(self.entity_class(**kwargs))
            #self.session.commit() # because autocommit=True
            return True
        except:
            return False

    ####################################
    # Update
    ####################################
    
    def update(self, **kwargs):
        #https://code-maven.com/slides/python-programming/orm-update        
        try:
            self.queryBy(id=kwargs['id']).update(kwargs)        
            #self.session.commit() # because autocommit=True
        except:
            return False
        return True

    ####################################
    # Delete
    ####################################
    
    def deleteById(self, id):
        return self.deleteBy(id=id)

    def deleteAll(self):
        return self.deleteBy()

    def deleteBy(self, **kwargs):
        try:
            self.queryBy(**kwargs).delete()
            #self.session.commit() # because autocommit=True
            return True
        except:
            return False
