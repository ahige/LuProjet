import uuid
from datetime import timedelta

from flask import Flask
from api import *
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={"/api/*": {"origins": "*"}})

#app = Flask(__name__, 
#   static_url_path='/static',
#    static_folder='static',
#    template_folder='templates')
app.secret_key = "Salut !!!"#uuid.uuid4()

app.register_blueprint(routesAPIREST)

@app.before_request
def before_request():
    print("Avant requête")
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=15) #default : 31 days

#@app.after_request
#def after_request(response):
#    print("Après requête")

#Comprendre les import avec le fichier test.py
#from test import *
#import test
#test.afficher_hello()


if __name__ == '__main__':
    app.run(debug=True)        