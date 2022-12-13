import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'; //"@types/jwt-decode": "^2.2.1", "jwt-decode": "^2.2.0",
import {API_URL} from '../Constantes';

import Login from './Login'
import ProduitsList from './produits/ProduitsList'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      display_login_form: true,
      display_produits_crud: false,
      display_admin: false
    };
    //avec un seul hangleFormChange : OK
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick = (e) => {
    e.preventDefault();
    this.logout();
  };

  logout = () => {
    let token = window.sessionStorage["token"]
    //NE PAS OUBLIER DE VIDER LE SESSION STORAGE        
    window.sessionStorage.clear();

    //Blacklister le token JWT
    fetch(API_URL + '/logout', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      this.setState({
        login: '',
        password: '',
        message: 'Vous avez été déconnecté',
        display_login_form: true,
        display_produits_crud: false
      });
    }).catch((error) => {
      ///if status code 401...
      this.setState({
        login: '',
        password: '',
        message: 'Vous avez été déconnecté car la session est expirée',
        display_login_form: true,
        display_produits_crud: false
      })

    });
  }

  handleSucessLoginForm = (response) => {
    console.log(response);
    let payload = jwt_decode(response.token);
    console.log(payload);

    window.sessionStorage["connected"] = true;
    window.sessionStorage["token"] = response.token
    window.sessionStorage["payload"] = JSON.stringify(payload);
    window.sessionStorage["role"] = payload.role;

    this.setState({ 
      login: payload.login, 
      display_login_form: false, 
      display_produits_crud: true, 
      display_admin: payload.role === 'admin',
      message: ''
    });
  }

  handleErrorLoginForm = (response) => {
    this.setState({ 'message': response.message });
  }

  render() {
    const message = this.state.message;
    return (
      <div>
        <div>{message}</div>
        {this.state.display_login_form ?
          <Login handleSuccessLoginForm={this.handleSucessLoginForm}
            handleErrorLoginForm={this.handleErrorLoginForm}
            handleLogout={this.logout} />
          : ""}
        {!this.state.display_login_form ? 
          this.state.display_admin ?
          <div>
            Vous êtes administrateur
          </div> 
          : 
          <div>
            Vous êtes utilisateur
          </div>
          :
          ""
        }
        {this.state.display_produits_crud ?
          <div>
            <h1>Bienvenue {this.state.login}</h1>
            <button onClick={this.handleLogoutClick}>Logout</button>
            <ProduitsList handleLogout={this.logout} />
          </div> : ""}
      </div>);
  }
}

export default Home;