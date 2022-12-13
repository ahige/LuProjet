from flask import jsonify
from . import routesAPIREST
from flask import redirect, request

from .services import ProduitService
from .services import AuthService

from werkzeug import secure_filename

import os
import uuid


# Create a directory in a known location to save files to.
uploads_dir_produits = os.path.join(os.path.dirname(__file__), '../static/uploads/produits')
os.makedirs(uploads_dir_produits, exist_ok=True)

#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits', methods=['GET']) 
def list_produits_controlleur(): 
    authService = AuthService()
    payload = authService.getValidJWTPayload(request)
    if payload is None:
        return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'}), 401

    #Fonctionnel
    produitService = ProduitService()
    listProduits = produitService.findAll()
    #listProduits = [
    #        {'name': 'savon de marseille', 'qty': 5, 'prix': 5, 'prix_total': 25},
    #        {'name': 'gel douche', 'qty': 3, 'prix': 10, 'prix_total': 30},
    #        {'name': 'chocolat', 'qty': 2, 'prix': 15, 'prix_total': 30},
    #        {'name': 'anti cafard', 'qty': 1, 'prix': 7, 'prix_total': 7}              
    #    ]

    listProduitsJSON = []

    for produit in listProduits:
        p = {}
        p['id'] = produit.id
        p['nom'] = produit.nom
        p['image'] = produit.image
        p['qty'] = produit.qty
        p['prix'] = produit.prix
        listProduitsJSON.append(p)

    return jsonify(listProduitsJSON)

#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['GET']) 
def get_produit_controlleur(id): 
    authService = AuthService()
    payload = authService.getValidJWTPayload(request)
    if payload is None:
        return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'}), 401

    #Fonctionnel
    produitService = ProduitService()
    produit = produitService.findOneById(id)

    if produit is None:
        return jsonify({ "message": "Le produit n'existe pas." })

    p = {}
    p['id'] = produit.id
    p['nom'] = produit.nom
    p['image'] = produit.image
    p['qty'] = produit.qty
    p['prix'] = produit.prix

    return jsonify(p)

#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits', methods=['POST']) 
def create_produit_controlleur(): 
    authService = AuthService()
    payload = authService.getValidJWTPayload(request)
    if payload is None:
        return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'}), 401

    #produit = request.json #Fonctionne avec un Content-Type: application/json
    
    ##Code traitant la récupération en FormData les données
    nom_produit = request.form.get('nom_produit')
    
    qty_produit = int(request.form.get('qty_produit'))
    prix_produit = float(request.form.get('prix_produit'))

    produit = {}
    produit['nom'] = nom_produit
    produit['qty'] = qty_produit
    produit['prix'] = prix_produit
    produit['image'] = ""

    ## Gestion de l'upload
    if 'image_produit' in request.files: 
        #récupération de l'objet contenant les informations
        #du fichier uploadé
        image_produit = request.files['image_produit']

        #Enregistrer le fichier dans le dossier upload de l'utilisateur
        filename_final = secure_filename(image_produit.filename)
        extension_filename = ""
        if "." in filename_final:
            extension_filename = filename_final.split(".")[-1]
        #uuid.uuid4().hex --> '9fe2c4e93f654fdbb24c02b15259716c'
        filename_final = uuid.uuid4().hex + "." + extension_filename

        destination_filename = os.path.join(uploads_dir_produits, filename_final)
        image_produit.save(destination_filename)    
        print("Filename upload : ", filename_final)

        produit['image'] = filename_final
    
    
    #Ajouter le produit dans la base de données
    #Fonctionnel
    produitService = ProduitService()
    isOk = produitService.create(produit)

    if not isOk:
        return jsonify({ "message": "Problème de création du produit." })

    return jsonify({ "message": "Le produit a bien été créé." })


#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['PUT']) 
def update_produit_controlleur(id): 
    authService = AuthService()
    payload = authService.getValidJWTPayload(request)
    if payload is None:
        return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'}), 401
    
    ##Code traitant la récupération en FormData les données
    nom_produit = request.form.get('nom_produit')
    
    qty_produit = int(request.form.get('qty_produit'))
    prix_produit = float(request.form.get('prix_produit'))

    produit = {}  
    produit['id'] = id
    produit['nom'] = nom_produit
    produit['qty'] = qty_produit
    produit['prix'] = prix_produit

    ## Gestion de l'upload
    #récupération de l'objet contenant les informations
    #du fichier uploadé
    if 'image_produit' in request.files: 
        image_produit = request.files['image_produit']

        #Enregistrer le fichier dans le dossier upload de l'utilisateur
        filename_final = secure_filename(image_produit.filename)
        extension_filename = ""
        if "." in filename_final:
            extension_filename = filename_final.split(".")[-1]
        #uuid.uuid4().hex --> '9fe2c4e93f654fdbb24c02b15259716c'
        filename_final = uuid.uuid4().hex + "." + extension_filename

        destination_filename = os.path.join(uploads_dir_produits, filename_final)
        image_produit.save(destination_filename)    
        print("Filename upload : ", filename_final)

        produit['image'] = filename_final
    
    
    #Mettre à jour le produit dans la base de données
    #Fonctionnel
    produitService = ProduitService()
    isOk = produitService.update(produit)

    if not isOk:
        return jsonify({ "message": "Le produit n'existe pas ou n'a pas besoin d'être à jour." })

    return jsonify({ "message": "Le produit a bien été mis à jour." })


#Pour tester : Utiliser POSTMAN
@routesAPIREST.route('/produits/<int:id>', methods=['DELETE']) 
def delete_produit_controlleur(id): 
    authService = AuthService()
    payload = authService.getValidJWTPayload(request)
    if payload is None:
        return jsonify({'message': 'Problème avec le JWT token dans le header HTTP Authorization'}), 401

    #Fonctionnel
    produitService = ProduitService()
    isOk = produitService.delete(id)

    if not isOk:
        return jsonify({ "message": "Le produit n'existe pas." })

    return jsonify({ "message": "Le produit a bien été supprimé." })
