import React from 'react';

class Todo extends React.Component {
  
  /**
   * When we create single Todo we are sending down the title, id and
   * user via props. We can grab the title from these props and store it in state
   * this is done because I am expecting to change the title of each todo, if the
   * value is subject of change we need to store it in state. The disabled value
   * is used to toggle the input-field when we press the 'Edit'-button
   */
  state = {
    title: this.props.title,
    disabled: true
  }

  /**
   * When we create a new <Todo> we are sending down the _id of 
   * each todo which means that inside of the component it is always
   * available, which means that there is no need to send it via onClick
   * as an argument. Each todo knows which _id it has.
   */
  patchTodo = () => {
    fetch(`/todos/${this.props._id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: this.state.title })
    })
    .then(response => response.json())
    .then((updatedTodo) => {
      /**
       * When we are done submitting the todo (which is on focus lost)
       * we can toggle the input field to be disabled again. But we also 
       * need to update the state in <App> because we have changed the todo
       * in the backed(database), but we have not updated the frontend state
       * of the todos. this.state.todos is inside of <App> but we use the
       * function sent down by props to update this state
       */
      this.setState({ disabled: true })
      this.props.updateTodos(updatedTodo);
    })
  }

  deleteTodo = () => {
    fetch(`/todos/${this.props._id}`, {
      credentials: 'same-origin',
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(deletedTodo => {
      this.props.filterTodos(deletedTodo);
    })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Togglefield toggles the disabled state of the input field,
   * when we visit the site the input is disabled because we don't want
   * to mistakenly edit an item. This input field is enabled if we press the
   * edit-button
   */
  toggleField = () => {
    this.setState({ disabled: !this.state.disabled })
  }
  
  /**
   * onBlur means when the inputfield loses focus == when we leave the field
   * with our keyboard/mouse.
   */
  render() {
    return (<div key={this.props._id}>
      <input 
        type="title"
        name="title"
        value={this.state.title}
        disabled={this.state.disabled}
        onChange={this.onChange}
        onBlur={this.patchTodo}
        className="form-control"
     />
      <button className="btn btn-info" onClick={this.toggleField}> 
        Edit 
      </button>
      <button className="btn btn-danger" onClick={this.deleteTodo}>
        Please delete
      </button>
    </div>)
  }
}

export default Todo;