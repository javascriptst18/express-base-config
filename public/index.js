let todoContainer = document.querySelector('#todoContainer')
let newTodoForm = document.querySelector('#newTodoForm')

function createHTML(todos){
  let html = '';
  for(let index in todos){
    /**
     * Instad of displaying the title as a regular <p>
     * we can use an input and set the value of the input
     * to the title of the todo. We also add two buttons
     * with two different classes because we need two actions
     */
    html += `
      <div class="todo" id=${index}>
        <input class="title" value="${todos[index].title}" />
        <button class="update">Update</button>
        <button class="delete">Delete</button>
      </div>
    `;
  }
  todoContainer.innerHTML = html;
}

function addDeleteEventlisteners() {
  const todoElements = document.querySelectorAll('.todo');
  for (let todo of todoElements) {
    /**
     * Click-event is added to the whole div with class of '.todo'
     * and we need both 'this' and 'event'
     */
    todo.addEventListener('click', function (event) {
      /**
       * If the clicked element on the div has the class '.delete'
       * which is the deletebutton, trigger the function to delete
       * the todo, send along 'this' which is the whole element
       * that we clicked.
       */
      if(event.target.matches('.delete')){
        deleteTodo(this);
      }
      /**
       * If we instead clicked the '.update'-button we want
       * to make a patch-request. But we need both an id
       * to patch and the value to send along in the patch-request
       */
      if(event.target.matches('.update')){
        /**
         * 'this' is the div. We can use querySelector on the div
         * instead of the whole document to get the input-field
         * inside of the div. then grab the value of it, which is
         * the title of the todo.
         */
        const value = this.querySelector('.title').value;
        // Send along both the id of the div and the value that we want to update
        patchTodo(this.id, value);
      }
    })
  }
}

// Just converts JSON to javascript, used in fetch-calls
function toJSON(response) {
  return response.json();
}

/**
 * Make a fetch-request, then convert to json
 * then call the createHTMl-function with the data
 * from the fetch, then add all the event listeners,
 * the eventlistener function does not need an argument
 * but we can still call it with then if we want it to 
 * happen after we added the html.
 */
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

/**
 * The 'id' is for the URL and the title is for the 
 * body. With patch we only need to send along the
 * values that we want ot update, the other values
 * will be ignored
 */
function patchTodo(id, title) {
  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: title })
  })
}

/**
 * 'todo' is the whole div-element. grab the id from the
 * element and pass it to the URL. Then call remove 
 * to remove the whole element from the DOM.
 */
function deleteTodo(todo){
  fetch(`/todos/${todo.id}`, {
    method: 'DELETE',
  })
  todo.remove();
}

function handleSubmitForm(event) {
  // Prevent form from submitting
  event.preventDefault();
  // Create a new object with the value from the form
  const newTodo = {
    title: this.title.value,
    completed: false
  }
  // Then call the fetch with the formatted object
  postTodo(newTodo);
}

// Bind the form-event and fetch the inital list of todos
newTodoForm.addEventListener('submit', handleSubmitForm);
fetchAllTodos();