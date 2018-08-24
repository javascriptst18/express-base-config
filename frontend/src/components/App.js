import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SubmitForm from './SubmitForm';
import Todo from './Todo';

class App extends Component {

  state = {
    todos: [],
    user: ''
  }

  componentDidMount(){
    fetch('/checkLoggedInState', {
      credentials: 'same-origin'
    }).then(response => response.json())
    .then(user => {
      this.setState({ user })
    })
  }

  login = (user) => {
    this.setState({ user });
    this.fetchTodos();
  }

  fetchTodos = () => {
    fetch('/todos', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(todos => this.setState({ todos }))
  }

  filterTodos = (removedTodo) => {
    console.log(removedTodo);
    const updatedTodos = this.state.todos.filter(todo => {
      return todo._id !== removedTodo._id;
    })
    this.setState({ todos: updatedTodos });
  }

  pushTodo = (newTodo) => {
    const updatedTodos = [...this.state.todos, newTodo];
    this.setState({ todos: updatedTodos });
  }

  render() {

    const todoList = this.state.todos.map(todo => 
      <Todo {...todo} key={todo._id} filterTodos={this.filterTodos} />
    )
    if(this.state.user){
      return (
        <div className="App">
          <SubmitForm pushTodo={this.pushTodo}/>
          {todoList}
        </div>
      );
    } else {
      return (
        <div className="App">
          <LoginForm login={this.login} />
        </div>
      );
    }
  }
}

export default App;
