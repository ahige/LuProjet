from flask import Blueprint

routesAPIREST = Blueprint('routesAPIREST', __name__, url_prefix='/api',
    static_url_path='/static',
    static_folder='../static',
    template_folder='../templates')


from .index_controller import *
from .login_controller import *
from .produit_controller import *
