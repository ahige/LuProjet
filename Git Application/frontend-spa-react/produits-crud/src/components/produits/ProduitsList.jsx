import React, { Component } from 'react';
import { API_URL, STATIC_URL } from '../../Constantes';

import AddProduit from './AddProduit';
import UpdateProduit from './UpdateProduit';

class ProduitsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "data": [],
      "message": "",
      "display_update_form": false,
      "data_form_update": {
        "id_produit_update": 0,
        "nom_produit_update": "",
        "qty_produit_update": 0,
        "prix_produit_update": 0
      }
    };

    //this.props = { handleLogout: FunctionObject };
  }

  componentDidMount() {
    this.refreshListProduits();
  }

  refreshListProduits = () => {
    return fetch(API_URL + '/produits', {
      method: 'GET',
      headers: {
        'Authorization': window.sessionStorage["token"],
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response)
      }
      return response.json();
    }).then(data => this.setState({ "data": data }))
      .catch((response) => {
        ///if status code 401...
        this.props.handleLogout();
      });
  }

  supprimerProduit = (id) => {
    return fetch(API_URL + '/produits/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': window.sessionStorage["token"],
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ "message": data.message }, () => {
          this.refreshListProduits();
        });

      }).catch((response) => {
        ///if status code 401...
        this.props.handleLogout();
      });
  }

  handleDeleteClick = (id, e) => {
    e.preventDefault();
    this.supprimerProduit(id);

    //Cacher le formulaire d'update si on a supprimé le produit sélectionné
    if (id === this.state.id_produit_update) {
      this.setState({
        "display_update_form": false
      });
    }
  }

  handleDisplayFormUpdateClick = (id, e) => {
    e.preventDefault();

    this.setState({
      display_update_form: false,
      data_form_update: {
        id_produit_update: -1,
        nom_produit_update: "",
        qty_produit_update: 0,
        prix_produit_update: 0
      }
    }, () => {
      //Mettre à jour avec le nouveau produit
      for (let index_produit = 0; index_produit < this.state.data.length; ++index_produit) {
        let produit = this.state.data[index_produit];
        if (produit['id'] === id) {
          console.log(produit);
          this.setState({
            display_update_form: true,
            data_form_update: {
              id_produit_update: id,
              nom_produit_update: produit['nom'],
              qty_produit_update: produit['qty'],
              prix_produit_update: produit['prix']
            }
          });
          break;
        }
      }
    });
  }

  handleSuccessAddForm = (response) => {
    this.setState({ 'message': response.message }, () => {
      this.refreshListProduits();
    });
  }

  handleErrorAddForm = (response) => {
    this.setState({ 'message': response.message })
  }

  handleSuccessUpdateForm = (response) => {
    this.setState({
      "display_update_form": false,
      'message': response.message
    }, () => {
      this.refreshListProduits();
    });
  }

  handleErrorUpdateForm = (response) => {
    this.setState({
      "display_update_form": false,
      'message': response.message
    });
  }

  handleHideUpdateForm = () => {
    this.setState({
      "display_update_form": false
    });
    this.refreshListProduits();
  }

  render() {
    const { data, message } = this.state;
    //console.log(data);
    return (
      <div className="App">
        <h1>CRUD Produits</h1>
        <h2>{message}</h2>
        <AddProduit handleSuccessAddForm={this.handleSuccessAddForm}
          handleErrorAddForm={this.handleErrorAddForm}
          handleLogout={this.props.handleLogout} />
        {this.state.display_update_form ?
          <UpdateProduit {...this.state.data_form_update}
            handleSuccessUpdateForm={this.handleSuccessUpdateForm}
            handleErrorUpdateForm={this.handleErrorUpdateForm}
            handleHideUpdateForm={this.handleHideUpdateForm}
            handleLogout={this.props.handleLogout} />
          : ""}
        <h2>Liste des produits</h2>
        <center>
          <table border="1">
            <thead>
              <tr>
                <td>ID Produit</td>
                <td>Nom Produit</td>
                <td>Image Produit</td>
                <td>Quantité</td>
                <td>Prix Unitaire (€)</td>
                <td>Prix Total (€)</td>
                <td>Modifier Produit</td>
                <td>Supprimer Produit</td>
              </tr>
            </thead>
            <tbody>
              {data.map((produit, i) =>
                <tr align="center" key={produit.id}>
                  <td>{produit.id}</td>
                  <td>{produit.nom}</td>
                  <td>{produit.image !== "" ?
                    <img width="50px" height="50px" alt={produit.image} src={STATIC_URL + '/uploads/produits/' + produit.image} />
                    : "Pas d'image"}
                  </td>
                  <td>{produit.qty}</td>
                  <td>{produit.prix}</td>
                  <td>{produit.qty * produit.prix}</td>
                  <td><button onClick={this.handleDisplayFormUpdateClick.bind(this, produit.id)}>Modifier Produit</button></td>
                  <td><button onClick={this.handleDeleteClick.bind(this, produit.id)}>Supprimer</button></td>
                </tr>)
              }
            </tbody>
          </table>
        </center>
      </div>
    );
  }
}

export default ProduitsList;
