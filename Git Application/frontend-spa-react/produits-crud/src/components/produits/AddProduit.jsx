import React, { Component } from 'react';
import {API_URL} from '../../Constantes';

class AddProduit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "nom_produit_add": "",
      "qty_produit_add": 0,
      "prix_produit_add": 0
    };

    //this.props = { handleLogout: FunctionObject };
    //avec un seul hangleFormChange : OK
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
  }

  ajouterProduit = () => {
    let nom_produit = this.state.nom_produit_add;
    let image_produit = "";
    let image_input_element = document.querySelector("#image_produit_add")
    if (image_input_element.value !== "") {
      image_produit = image_input_element.files[0]; //Info + Contenu du fichier
    }
    let qty_produit = this.state.qty_produit_add;
    let prix_produit = this.state.prix_produit_add;

    let data = new FormData();
    data.append('nom_produit', nom_produit);
    data.append('image_produit', image_produit);
    data.append('qty_produit', qty_produit);
    data.append('prix_produit', prix_produit);

    return fetch(API_URL + '/produits',
      {
        method: 'POST',
        headers: {
          'Authorization': window.sessionStorage["token"]
        },
        body: data
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response)
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.props.handleSuccessAddForm({ "message": data.message });
      }).catch((response) => {
        ///if status code 401...
        //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
        if (response.status === 401) {

          //this.setState({ "message": 'Pas authorisé, vous allez être redirigé...' });
          this.props.handleLogout();

        } else {
          this.props.handleErrorAddForm({ "message": 'Problème de création du produit' });
        }
      });
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

  handleAddClick = (e) => {
    e.preventDefault();
    this.ajouterProduit();
  }

  render() {
    return (
      <div className="App">
        <h2>Ajout de produit</h2>
        <form align="center">
          Nom Produit : <input onChange={this.handleFormInputChange} type="text" name="nom_produit_add" value={this.state.nom_produit_add} />
          <br />
          Image Produit : <input id="image_produit_add" onChange={this.handleFormInputChange} type="file" name="image_produit_add" />
          <br />
          Quantité : <input onChange={this.handleFormInputChange} type="number" name="qty_produit_add" value={this.state.qty_produit_add} />
          <br />
          Prix : <input onChange={this.handleFormInputChange} type="number" name="prix_produit_add" value={this.state.prix_produit_add} />
          <br />
          <button onClick={this.handleAddClick.bind(this)}>Ajouter</button>
        </form>
      </div>
    );
  }
}

export default AddProduit;
