import React, { Component } from 'react';

class LoginForm extends Component {

  state = {
    email: '',
    password: '',
    error: ''
  }

  // We need to submit the form
  onSubmit = (event) => {
    // Always prevent the form from submitting
    event.preventDefault();
    fetch(`/login`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          username: this.state.email, 
          password: this.state.password 
        })
      })
      .then(response => response.json())
      .then(user => {
        this.props.login(user);
      })
      .catch(error => {
        this.setState({ error: error.message });
      })
    }

  // This replaces both handleEmail and handlePassword
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input name="email" onChange={this.handleChange} value={this.state.email}
              type="text" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">{ this.state.error }</small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input name="password" onChange={this.handleChange} value={this.state.password}
              type="password" className="form-control" id="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;