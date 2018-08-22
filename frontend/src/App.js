import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    todos: [],
    todoValue: ''
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
      this.setState({ 
        todos: updatedTodo,
        todoValue: ''
      });
    })
  }

  deleteTodo = (todo) => {
    fetch(`http://localhost:4000/todos/${todo._id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(removedTodo => {
        const updatedTodos = this.state.todos.filter(todo => {
          return todo._id !== removedTodo._id;
        });
        this.setState({ todos: updatedTodos });
    })
  }

  render() {
    const todoList = this.state.todos.map(todo => {
      return <div key={todo._id}>
        <p>{todo.title}</p>
        <button onClick={() => this.deleteTodo(todo)}>
          Please Delete
        </button>
      </div>
    })
    return (
      <div className="App">
        {
          todoList
        }
      </div>
    );
  }
}

export default App;
