from ..dao import ClientDao
import hashlib
import jwt
from datetime import datetime, timedelta
import time

JWT_SECRET = 'mysecret'
JWT_ALGORITHM = 'HS256'
#Durée de validité du TOKEN (session)
#avec JWT, plus de notion de session gérée par un serveur
JWT_EXP_DELTA_SECONDS = 30*60 #30 minutes (durée session)
JWT_TOKEN_BLACK_LIST = set()

class AuthService:

    def __init__(self):
        self.dao = ClientDao()

    def isExistLogin(self, login):
        return self.dao.findOneBy(login=login) is not None
    
    def generateJWT(self, login, password):
        password_hash = hashlib.sha1(password.encode('utf-8')).hexdigest()
        client = self.dao.findOneBy(login=login, password=password_hash)
        print('generateJWT client : ', client)
        if client is None:
            return None

        payload = {
            'id_user': client.id,
            'login': client.login,
            'role': client.role, 
            'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        return jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)


    def getValidJWTPayload(self, request):
        payload = None

        jwt_token = request.headers.get('Authorization')   
        if jwt_token in JWT_TOKEN_BLACK_LIST:
            return payload

        try:
            payload = jwt.decode(jwt_token, JWT_SECRET, JWT_ALGORITHM)
            if payload['exp'] < int(time.time()):
                return None
        except (KeyError, jwt.DecodeError, jwt.ExpiredSignature):
            return payload

        return payload

    def invalidateJWT(self, jwt_token):
        try:
            payload = jwt.decode(jwt_token, JWT_SECRET, JWT_ALGORITHM)
            JWT_TOKEN_BLACK_LIST.add(jwt_token)
            #return jsonify({'message': 'Utilisateur {0} déconnecté'.format(payload['nom'])})
        except (KeyError, jwt.DecodeError, jwt.ExpiredSignature):
            pass
            #return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'})
        return True
