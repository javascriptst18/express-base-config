import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    todos: [],
    deleteText: "",
    postText: ""
  }

  componentDidMount(){
    fetch('http://localhost:4000/todos').then(response => response.json())
      .then(todos => {
        this.setState({ todos: todos})
      })
  }

  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value})
  }

  // Standard fetch parametrar
  /* fetch('url', {
    method: 'post',
    header: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify({title: 'HOHO'})
  }) */

  postTodo = () => {
    fetch('http://localhost:4000/todos', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title: this.state.postText})
    })
    .then(response => response.json())
    .then(addedTodo => {
      // Kopia av state
      // pushar in i kopian
      // byter ut state mot den nya kopian
      const updatedTodo = [...this.state.todos]
      updatedTodo.push(addedTodo);
      this.setState({ todos: updatedTodo })
    })
  };

  deleteInput = (event) => {
    this.setState({ deleteText: event.target.value})
  }

  deleteTodo = () => {
    fetch(`http://localhost:4000/todos/${this.state.deleteText}`, {
      method: 'delete',
      })
      .then(response => response.json())
      .then(deletedTodo => {
        const copyTodo = [...this.state.todos]
        const updatedTodo = copyTodo.filter(todo => 
          todo.title !== this.state.deleteText
        )
        this.setState({ todos: updatedTodo })
      })
  }

  render() {

    const todos = this.state.todos;
    const listOfTodos = todos.map(todo => (
      <div key={todo._id}>
        <h3>{todo.title}</h3>
      </div>
    ));

    return (
      <div className="App">
        <label htmlFor="postText">Post</label>
        <input 
          type="text"
          name="postText"
          value={this.state.postText}
          onChange={this.onChangeInput}
        />
        <button onClick={this.postTodo}>Post from frontend</button>
        <label htmlFor="deleteText">Delete a post by title</label>
        <input 
          type="text"
          name="deleteText"
          value={this.state.deleteText}
          onChange={this.onChangeInput}
        />
        <button onClick={this.deleteTodo}>Delete todo</button>
        { listOfTodos }
      </div>
    );
  }
}

export default App;

