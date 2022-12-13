import React, { Component } from 'react';
import {API_URL} from '../Constantes';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      message: ''
    };
    //avec un seul hangleFormChange : OK
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
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
  handleLoginClick = (e) => {
    e.preventDefault();
    this.login();
  };

  login = () => {
    let login = this.state.login;
    let password = this.state.password;

    fetch(API_URL + '/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'login': login,
          'password': password
        })
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response);
        }
        return response.json();
      })
      .then(data => {
        this.props.handleSuccessLoginForm(data);
      }).catch((error) => {
        ///if status code 401...
        this.props.handleErrorLoginForm({ message: 'Login invalide !' });
      });
  }

  render() {
    return (
      <div>
        Page de Login
          <form>
          Login : <input onChange={this.handleFormInputChange} id="login" type="text" name="login" value={this.state.login} /><br />
          Password : <input onChange={this.handleFormInputChange} id="password" type="password" name="password" value={this.state.password} /><br />
          <input onClick={this.handleLoginClick} type="button" value="Se connecter" />
        </form>
      </div>);
  }
}

export default Login;