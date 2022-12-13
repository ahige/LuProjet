import React, { Component } from 'react';
import {API_URL} from '../../Constantes';

class UpdateProduit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "message": "",
            ...props
        };

        //this.props = { handleLogout: FunctionObject };

        //avec un seul hangleFormChange : OK
        this.handleFormInputChange = this.handleFormInputChange.bind(this);
    }

    modifierProduit = (id) => {

        let nom_produit = this.state.nom_produit_update;
        let image_produit = "";
        let image_input_element = document.querySelector("#image_produit_update")
        if (image_input_element.value !== "") {
            image_produit = image_input_element.files[0]; //Info + Contenu du fichier
        }
        let qty_produit = this.state.qty_produit_update;
        let prix_produit = this.state.prix_produit_update;

        let formData = new FormData();
        formData.append('nom_produit', nom_produit);
        formData.append('image_produit', image_produit);
        formData.append('qty_produit', qty_produit);
        formData.append('prix_produit', prix_produit);

        return fetch(API_URL + '/produits/' + id,
            {
                method: 'PUT',
                headers: {
                    'Authorization': window.sessionStorage["token"]
                },
                body: formData
            }).then(response => {
                if (response.status !== 200) {
                    throw new Error(response)
                }
                return response.json();
            })
            .then(data => {
                this.props.handleSuccessUpdateForm({ "message": data.message });
            }).catch((response) => {
                ///if status code 401...
                //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
                if (response.status === 401) {
                    this.props.handleLogout();
                } else {
                    this.props.handleErrorUpdateForm({ "message": 'Problème de modification du produit' });
                }
            });
    }

    handleUpdateClick = (id, e) => {
        e.preventDefault();
        this.modifierProduit(id);
    }

    //handleFormInput générique :)
    handleFormInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleHideUpdateFormClick = (e) => {
        e.preventDefault();
        this.props.handleHideUpdateForm();
    }

    render() {
        return (
            <div>
                <h2>Modifier le produit d'id = {this.state.id_produit_update}</h2>
                <button onClick={this.handleHideUpdateFormClick.bind(this)}>Fermer le formulaire de mise à jour</button>
                <br />
                <br />
                <form align="center">
                    Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_update" value={this.state.nom_produit_update} />
                    <br />
                    Image Produit : <input id="image_produit_update" onChange={this.handleFormInputChange} type="file" name="image_produit_update" />
                    <br />
                    Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_update" value={this.state.qty_produit_update} />
                    <br />
                    Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_update" value={this.state.prix_produit_update} />
                    <br />
                    <button onClick={this.handleUpdateClick.bind(this, this.state.id_produit_update)}>Mettre à jour</button>
                </form>
            </div>
        );
    }
}

export default UpdateProduit;
