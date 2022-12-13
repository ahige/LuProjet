from flask import jsonify
from . import routesAPIREST
from flask import session, redirect, request


@routesAPIREST.route('/', methods=['GET']) 
def home_access_controlleur():
    return "Welcome to our API"
