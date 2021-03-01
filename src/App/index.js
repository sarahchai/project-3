import React, { Component } from "react";
import "./style.css";
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import LoginOrRegistration from "../LoginOrRegistration";
import ContactsListPage from "../ContactsListPage";
import PrivateRoute from "../PrivateRoute";
import AddContact from "../AddContact";
import DetailContactPage from "../DetailContactPage";
import EditContactPage from "../EditContactPage"


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEmail: "",
      password: "",
      emailValid: true,
      passwordValid: true,
    }
  }

  onInputChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    })

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.{6,32}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*/;

    const validateEmail = emailRegex.test(String(this.state.userEmail).toLowerCase());
    const validatePassword = passwordRegex.test(String(this.state.password));

    this.setState({
      emailValid: validateEmail,
      passwordValid: validatePassword,
    })
  }

  logout = () => {
    localStorage.clear();
  }

  render() {
    return (
      <Router>
        <div className="App app-container">
          <div className="nav-container">
              <Link to="/"><button className="home-buttom">Home</button></Link>
              <Link to="/login"><button className="logout-buttom">Logout</button></Link>
          </div>
              <p className="header-title">Remember Me!</p>
          <div className="square-container">
            <Route
              path="/login"
              render={(props) => <LoginOrRegistration {...props} emailValid={this.state.emailValid} passwordValid={this.state.passwordValid} userEmail={this.state.userEmail} password={this.state.password} onLogIn={this.onLogIn} onInputChange={this.onInputChange} />}
            />
            <PrivateRoute path="/addcontact" exact component={AddContact} />
            <PrivateRoute path="/" exact component={ContactsListPage} />
            <PrivateRoute path="/detailcontact/:id" exact component={DetailContactPage} />
            <PrivateRoute path="/editcontact/:id" exact component={EditContactPage} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
