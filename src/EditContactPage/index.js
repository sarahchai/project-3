import React, { Component } from 'react'
import "./style.css"
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import PrivateRoute from "../PrivateRoute";

export default class EditContactPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      contactInfo: "",
      whereYouMet: "",
      importance: "",
      linkedInFriends: "",
      conversationDetails: "",
      submittedEditContact: false
    }
  }

  onInputChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  // onChangeBoolean = evt => {
  //   this.setState({
  //     linkedInFriends: 
  //   })
  // }

  componentDidMount = async () => {
    const id = this.props.match.params.id
    const findContactInfo = await fetch(`/api/contacts/${id}`)
    const contactInfo = await findContactInfo.json()
    this.setState({
      name: contactInfo.name,
      contactInfo: contactInfo.contactInfo,
      whereYouMet: contactInfo.whereYouMet,
      importance: contactInfo.importance,
      linkedInFriends: JSON.parse(contactInfo.linkedInFriends),
      conversationDetails: contactInfo.conversationDetails
    })
  }

  editContact = async () => {
    const id = this.props.match.params.id
    const body = JSON.stringify({
      name: this.state.name,
      contactInfo: this.state.contactInfo,
      whereYouMet: this.state.whereYouMet,
      importance: this.state.importance,
      linkedInFriends: this.state.linkedInFriends,
      conversationDetails: this.state.conversationDetails
    });

    const newContact = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const newContactInfo = await newContact.json();

    this.setState({
      submittedEditContact: true
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
  }


  render() {
    if (this.state.submittedEditContact) {
      const { from } = this.props.location.state || { from: { pathname: `/detailcontact/${this.props.match.params.id}` } };
      return (
        <Redirect to={from} />
      )
    }
    let booleanParse = null
    if (this.state.linkedInFriends === true || this.state.linkedInFriends === false) {
      booleanParse = JSON.parse(this.state.linkedInFriends)
    }
    return (
      <div className="edit-form-container">
        <h1>Edit Contact Page</h1>
        <form className="all-form-containers" onSubmit={this.onSubmit}>
          <label htmlFor="input-name" className="add-label add-name-label">Full Name/Nickname</label>
          <input id="input-name" className="add-input name" type="text" name="name" value={this.state.name} onChange={this.onInputChange} />
          <br></br>
          <label htmlFor="input-ContactInfo" className="add-label add-contactInfo-label">Email/Phone#/Other</label>
          <input id="input-ContactInfo" className="add-input inputContactInfo" type="text" name="contactInfo" value={this.state.contactInfo} onChange={this.onInputChange} />
          <br></br>
          <label htmlFor="input-WhereYouMet" className="add-label add-contactWhereYouMet-label">Event/Location of Initial Meeting</label>
          <input id="input-WhereYouMet" className="add-input inputWhereYouMet" type="text" name="whereYouMet" value={this.state.whereYouMet} onChange={this.onInputChange} />
          <br></br>
          <label htmlFor="input-Importance" className="add-label add-contactImportance-label">Importance (1-5)</label>
          <select className="edit-input importancce-dropdown" name="importance" value={this.state.importance} onChange={this.onInputChange} >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <br></br>
          <label htmlFor="input-LinkedInFriends" className="add-label add-LinkedInFriends-label">Connected LinkedIn Friends? (Y/N)</label>
          <select className="edit-input inputLinkedInFriends" name="linkedInFriends" value={this.state.linkedInFriends} onChange={this.onInputChange} >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <br></br>
          <label className="add-label add-ConversationDetails-label">Conversation Details</label>
          <textarea className="inputConversationDetails" name="conversationDetails" value={this.state.conversationDetails} onChange={this.onInputChange} rows="10" cols="60" />
          <br></br>
          <button onClick={this.editContact}>Submit</button>
        </form>
      </div>
    )
  }
}
