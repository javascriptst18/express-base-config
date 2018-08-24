import React from 'react';

class SubmitForm extends React.Component {
  
  state = {
    newTodo: ''
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.postTodo();
  }

  postTodo = () => {
    fetch('/todos', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: this.state.newTodo })
    })
    .then(response => response.json())
    .then(newTodo => {
      /**
       * Because all todos are inside of <App> we must update the state
       * in app by calling the function pushTodo inside of <App>, this function
       * is being sent down via props. newTodo is the POSTed todo that is returned
       * from the backend side. 
       */
      this.props.pushTodo(newTodo);
    })
  }

  render(){
    return (
    <form onSubmit={this.onSubmit}>
      <input
        type="text"
        name="newTodo"
        value={this.state.newTodo}
        onChange={this.onChange}
        className="form-control"
      />
      <button className="btn btn-primary" type="submit">
        Skicka
      </button>
    </form>
    )
  }
}

export default SubmitForm;