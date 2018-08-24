import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SubmitForm from './SubmitForm';
import Todo from './Todo';
import './App.css';

class App extends Component {

  state = {
    todos: [],
    user: '',
    error: '',
    isLoading: false
  }

  componentDidMount(){
    /**
     * localStorage is for saving any data to the users browser
     * On mount, check if user has logged in earlier. If the variable
     * user is null we have not logged in. If the user has logged in before,
     * parse the object in 'user' and set it in state. If the user is authed
     * we can also fetch the todos because we have set a cookie in the browser
     * which is being sent with fetch
     */
    const user = localStorage.getItem('user');
    if(user){
      this.setState({ user: JSON.parse(user) });
      this.fetchTodos();
    }
  }

  login = (user) => {
    /**
     * On successful login, save the user to the state. This login-function
     * is being called from <LoginForm>, we are sending it as a prop and the function
     * will in turn send up a user on sucessful login
     */
    this.setState({ user });
    /**
     * Also save the user to localstorage for faster login and avoid making an extra
     * call to the backend to check if the user is logged in. We also need to stringify
     * the user object before we save it because localStorage only accepts strings, stringify
     * turns an object into a string
     */
    localStorage.setItem('user', JSON.stringify(user));
    this.fetchTodos();
  }

  logout = () => {
    fetch('/logout')
      .then(() => {
        /**
         * logout is a regular fetch, and if the fetch is successful we know that we have 
         * logged out, but the frontend doesn't know so we need to reset the state to update
         * the UI
         */
        this.setState({ user: ''});
      })
  }

  fetchTodos = () => {
    /**
     * Change loading state before fetch happens, this will trigger a 'Loading'-message
     */
    this.setState({ isLoading: true })
    fetch('/todos', {
      credentials: 'same-origin'
    })
    .then(response => {
      /**
       * Unauthorized error not being catched correctly can be handled by
       * manually checking the status of the response object. If the status is 401
       * we are not logged in on the backend side and will get an error. This means that
       * we can reset the user in the state and throw a new error on the frontend. This
       * will in turn get catched by the .catch(). If we are authorized by backend we can return
       * response.json() as usual and continue to the next .then which will set the state
       */
      if(response.status === 401){
        this.setState({ user: '' })
        throw new Error('Unathorized');
      } else {
        return response.json()
      }
    })
    .then(todos => this.setState({ todos, isLoading: false }))
    .catch(()=> this.setState({ error: 'Något gick fel.'}))
  }

  /**
   * The functions below are not being called from inside of App, I am sending them down
   * to each <Todo>-component. But because they are changing the state of the <App />-component
   * they must be in the <App>-component. removedTod, newTodo and updatedTodo are being sent up to <App>
   * from the onClicks inside of each <Todo>-item
   */
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

  updateTodos = (updatedTodo) => {
    const updatedTodos = this.state.todos.map(todo => {
      if(todo._id === updatedTodo._id){
        return updatedTodo;
      }
      return todo;
    })
    this.setState({ todos: updatedTodos });
  }

  render() {

    /**
     * Instead of creating the todo-structure directly inside of <App>, extract each todo into 
     * a single component. This will enable us to have a state inside of each of the todo items
     * which will help us to edit the todo.
     */
    const todoList = this.state.todos.map(todo => 
      <Todo {...todo} key={todo._id} filterTodos={this.filterTodos} updateTodos={this.updateTodos}/>
    )
    /**
     * If the user is logged in there is an object inside of user. If we are not logged in the user
     * will be empty string which will be false. We can use a if-statement to return either the
     * LoginForm or the SubmitForm + the list of Todos
     */
    if(this.state.user){
      return (
        <div className="App container">
          <button className="btn btn-primary" onClick={this.logout} > Logout</button>
          <SubmitForm pushTodo={this.pushTodo}/>
          { this.state.isLoading 
            ? <div class="lds-ring"><div></div><div></div><div></div><div></div></div>  
            : todoList }
        </div>
      );
    } else {
      return (
        <div className="App container">
          <LoginForm login={this.login} />
        </div>
      );
    }
  }
}

export default App;
