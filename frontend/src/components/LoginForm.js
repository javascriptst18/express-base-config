import React, { Component } from 'react';

/**
 * This is basically the login-form from our earlier exercise but instead
 * of just displaying the state on submit I have replaced the setState with
 * a fetch('/login'). This also removes the need to store email, password and error
 * message inside of <App>-state. 
 */
class LoginForm extends Component {

  state = {
    email: '',
    password: '',
    error: ''
  }

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
        /**
         * On successful login we call the function login that is located
         * inside of <App>, this is because the state user in <App> decides
         * what component to show. So the user inside of this component is only
         * for the input-field. The looged in user is saved inside of <App>
         */
        this.props.login(user);
      })
      .catch(error => {
        this.setState({ error: 'Felaktigt lösenord eller användarnamn' });
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
            <small id="emailHelp" className="form-text text-danger">{ this.state.error }</small>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input name="password" onChange={this.handleChange} value={this.state.password}
              type="password" className="form-control" id="password" placeholder="Password" />
            <small id="emailHelp" className="form-text text-danger">{this.state.error}</small>

          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;