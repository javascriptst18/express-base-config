import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    todos: [],
    todoValue: '',
    patchTodoValue: ''
  }

  componentDidMount() {
    this.fetchTodos();
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
      body: JSON.stringify({ title: this.state.todoValue })
    })
    .then(response => response.json())
    .then(addedTodo => {
      /**
       * Copy the array then push the new value, save the
       * whole new array
       */
      const updatedTodos = [...this.state.todos];
      updatedTodos.push(addedTodo);
      this.setState({ 
        todos: updatedTodos,
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
      /**
       * Loop through each todo in state and return everything
       * except the removed todo. This will leave us with a new
       * array that has one todo removed, the matching todo
       */
        const updatedTodos = this.state.todos.filter(todo => {
          return todo._id !== removedTodo._id;
        });
        this.setState({ todos: updatedTodos });
    })
  }

  patchTodo = (todo) => {
    fetch(`http://localhost:4000/todos/${todo._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: this.state.patchTodoValue })
    })
      .then(response => response.json())
      .then(patchedTodo => {
        /**
         * loop through each todo in state, if the ID of the todo
         * in state is the same as the response from the server, the
         * todo has been updated and we can return the updated value,
         * if it is any other value, return the old todo. Check line
         * 66 in index.js to see the change there
         */
        const updatedTodos = this.state.todos.map(todo => {
          if(todo._id === patchedTodo._id){
            return patchedTodo;
          }
          return todo;
        })
        this.setState({
          todos: updatedTodos,
          patchTodoValue: ''
        });
      })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = event => {
    event.preventDefault();
    this.postTodo();
  }

  render() {

    const todoList = this.state.todos.map(todo => {
      return <div key={todo._id}>
        <p>{todo.title}</p>
        <button onClick={() => this.deleteTodo(todo)}>
          Please delete
        </button>
        <button onClick={() => this.patchTodo(todo)}>
          Please update
        </button>
      </div>
    })

    /**
     * The update value solution is a bit awkward. Enter a value
     * in the input then press the corresponding button on the
     * todo you want to update
     */
    return (
      <div className="App">
      <label htmlFor="patchTodoValue" style={{ display: 'block'}}>
        Update value here
      </label>
        <input
          type="text"
          value={this.state.patchTodoValue}
          onChange={this.onChange}
          name="patchTodoValue"
          placeholder="Update value here"
          id="patchTodoValue"
        />
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="todoValue"
            value={this.state.todoValue}
            onChange={this.onChange}
          />
          <button type="submit">
            Skicka
          </button>
        </form>
        {todoList}
      </div>
    );
  }
}

export default App;
