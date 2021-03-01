import React, { Component } from 'react'
import "./style.css"
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import PrivateRoute from "../PrivateRoute";


export default class LoginOrRegistration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      errorMessage: '',
    }
  }

  register = async () => {
    if (this.props.emailValid && this.props.passwordValid) {
      const body = JSON.stringify({
        userEmail: this.props.userEmail,
        password: this.props.password
      });
      const addUserResponse = await fetch('/api/register', {
        method: "POST",
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const addUserBody = await addUserResponse.json();

      if (addUserResponse.status === 409 || addUserResponse.status === 400) {
        this.setState({
          errorMessage: addUserBody.message
        })
      } else {
        localStorage.setItem('user-jwt', addUserBody);
        this.setState({
          loggedIn: true
        })
        console.log('hi');
      }
    }
    else {
     console.log('email or password invalid')
   }
  }

  logIn = async () => {
    const body = JSON.stringify({
      userEmail: this.props.userEmail,
      password: this.props.password
    });

    const checkUserResponse = await fetch('/api/login', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const checkUserBody = await checkUserResponse.json();

    if (checkUserResponse.status === 409 || checkUserResponse.status === 401 || checkUserResponse.status === 400) {
      this.setState({
        errorMessage: checkUserBody.message
      })
    } else {
      localStorage.setItem('user-jwt', checkUserBody);
      this.setState({
        loggedIn: true
      })
    }
  }



  render() {
    if (this.state.loggedIn) {
      const { from } = this.props.location.state || { from: { pathname: "/" } };
      return (
        <Redirect to={from} />
      )
    }
    return (
      <div className="form-container">
        <form className="login-form">
          <label className="login-label email">Email</label>
          <input className="login-input email" type="text" name="userEmail" onChange={this.props.onInputChange} />
          <label className="login-label password">Password</label>
          <input className="login-input password" type="text" name="password" onChange={this.props.onInputChange} />
          {!this.props.emailValid && (
              <div className="">
                <p>Enter valid email</p>
              </div>
            )}
          {this.props.emailValid && !this.props.passwordValid && (
              <div className="">
                <p>Enter at least 6 characters and include a number, lowercase, and upercase letter.</p>
              </div>
            )}
            
          <button type="button" onClick={this.register}>Register</button>
          <button type="button" onClick={this.logIn}>Log in</button>
          <p>{this.state.errorMessage}</p>
        </form>
      </div>
    )
  }
}