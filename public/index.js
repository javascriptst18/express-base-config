const elements = {
  todoContainer: document.querySelector('#todoContainer'),
  newTodoForm: document.querySelector('#newTodoForm')
}

function createHTML(todos){
  let html = '';
  for(let index in todos){
    html += `
      <div class="todo" id=${index}>
        <p> ${todos[index].title} </p>
      </div>
    `;
  }
  elements.todoContainer.innerHTML = html;
}

function toJSON(response){
  return response.json();
}

function fetchAllTodos() {
  fetch('/todos')
    .then(toJSON)
    .then(createHTML)
    .then(addDeleteEventlisteners)
}

function postTodo(newTodo){
  fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(newTodo)
  })
  .then(toJSON)
  .then(createHTML)
  .then(addDeleteEventlisteners)
}

function deleteTodo(todo){
  fetch(`/todos/${todo.id}`, {
    method: 'DELETE',
  })
  todo.remove();
}

function handleSubmitForm(event) {
  event.preventDefault();
  const newTodo = {
    title: this.title.value,
    completed: false
  }
  postTodo(newTodo);
}

function addDeleteEventlisteners(){
  const todoElements = document.querySelectorAll('.todo');
  for(let todo of todoElements){
    todo.addEventListener('click', function(){
      deleteTodo(this);
    })
  }
}

newTodoForm.addEventListener('submit', handleSubmitForm);
fetchAllTodos();