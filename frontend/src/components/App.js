import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SubmitForm from './SubmitForm';
import Todo from './Todo';

class App extends Component {

  state = {
    todos: [],
    user: '',
    error: '',
    isLoading: false
  }

  componentDidMount(){
    const user = localStorage.getItem('user');
    if(user){
      this.setState({ user: JSON.parse(user) });
      this.fetchTodos();
    }
  }

  login = (user) => {
    this.setState({ user });
    localStorage.setItem('user', JSON.stringify(user));
    this.fetchTodos();
  }

  fetchTodos = () => {
    this.setState({ isLoading: true })
    fetch('/todos', {
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(todos => this.setState({ todos, isLoading: false }))
  }

  filterTodos = (removedTodo) => {
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
