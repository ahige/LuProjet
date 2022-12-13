
class AbstractService:

    def __init__(self, dao_class):
        self.dao = dao_class()
        
    def findAll(self):
        return self.dao.findAll()

    def findOneById(self, id):
        return self.dao.findOneById(id)

    def create(self, entity):
        return self.dao.create(**entity)

    def update(self, entity):
        return self.dao.update(**entity)

    def delete(self, id):
        return self.dao.deleteById(id)