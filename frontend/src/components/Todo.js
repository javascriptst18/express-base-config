import React from 'react';

class Todo extends React.Component {
  state = {
    text: this.props.text,
    isEditing: false
  }

  patchTodo = (todo) => {
    fetch(`/todos/${todo._id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: this.state.text })
    })
    .then(response => response.json())
  }

  deleteTodo = (id) => {
    fetch(`/todos/${id}`, {
      credentials: 'same-origin',
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(deletedTodo => {
      this.props.filterTodos(deletedTodo);
    })
  }

  render() {
    const { _id, title, } = this.props;
    return (<div key={_id}>
      <p>{title}</p>
      <button onClick={() => this.deleteTodo(_id)}>
        Please delete
        </button>
    </div>)
  }
}

export default Todo;