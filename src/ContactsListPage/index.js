import React, { Component } from 'react'
import "./style.css"
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import AddContact from "../AddContact";
import PrivateRoute from "../PrivateRoute";
import DetailContactPage from "../DetailContactPage";


export default class ContactsListPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contacts: []
    }
  }

  componentDidMount = async () => {
    const allContacts = await fetch('/api/current-user/contacts', {
      method: 'GET',
      headers: {
        'jwt-token': localStorage.getItem('user-jwt')
      }
    })

    const allContactsInfo = await allContacts.json();

    this.setState({
      contacts: allContactsInfo
    })
  }

  sortByImportance = async () => {
    const allContactsImportance = await fetch('/api/current-user/contacts/important', {
      method: 'GET',
      headers: {
        'jwt-token': localStorage.getItem('user-jwt')
      }
    })

    const allContactsInfoImportance = await allContactsImportance.json();

    this.setState({
      contacts: allContactsInfoImportance
    })
  }

  sortByDateAdded = async () => {
    const allContacts = await fetch('/api/current-user/contacts', {
      method: 'GET',
      headers: {
        'jwt-token': localStorage.getItem('user-jwt')
      }
    })

    const allContactsInfo = await allContacts.json();

    
    this.setState({
      contacts: allContactsInfo
    })
  }

  render() {
    return (
      <div className="Contacts">
      <div className="contact-container">
          {/* <p className="contact-header"> Contacts </p> */}
          <Link className="addcontact-button-container" to="/addcontact"><img className="addcontact-button" src={"/images/add-a-button-icon-64392.png"}/></Link>
        </div>
      <div className="all-form-containers">
        
        
        
        <nav className="sort-container">           
           <button className="sort-button" onClick={this.sortByImportance}>Importance </button>
           <button className="sort-button" onClick={this.sortByDateAdded}>Date Added </button>
        </nav>
        {this.state.contacts.map(contact => <Link className="each-contact-name" to={'/detailcontact/' + contact.id} key={contact.id} ><p className="each-contact-name" key={contact.id} >{contact.name}</p></Link>)}
        </div>
      </div>
    )
  }
}