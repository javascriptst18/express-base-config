import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    todos: []
  }

  componentDidMount() {
    this.fetchTodos();
    this.postTodo();
  }

  fetchTodos = () => {
    fetch('http://localhost:4000/todos')
      .then(response => response.json())
      .then(todos => {
        this.setState({ todos });
      })
  }

  postTodo = () => {
    fetch('http://localhost:4000/todos', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({ title: 'HOH!'})
    })
    .then(response => response.json())
    .then(addedTodo => {
      const updatedTodo = [...this.state.todos];
      updatedTodo.push(addedTodo);
      this.setState({ todos: updatedTodo });
    })
  }

  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
