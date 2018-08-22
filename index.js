const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(
  'mongodb://javascriptst18:javascriptst18@ds125402.mlab.com:25402/javascriptst18'
);

app.use(express.static('public'));

app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user

let todos = [
  {
    title: 'Learn Backend',
    completed: false
  },
  {
    title: 'Learn to learn',
    completed: true
  }
];

const Todo = mongoose.model('Todo', {
  title: String,
  completed: Boolean
});

app.get('/todos', function(request, response) {
  Todo.find({})
    .then((documents) => {
      response.json(documents);
    })
});

app.post('/todos', function (request, response) {
  const newTodo = new Todo({ title: request.body.title, completed: false });
  newTodo.save()
    .then(document => {
      response.json(document);
    });
});

app.get('/todos/:id', function (request, response) {
  /**
   * :id is saved as 'request.params.id'. so if we visit '/todos/1'
   * req.params.id will be 1. '/todos/2' will give us req.params.id === 2
   * it can be a good idea to convert the number to an int. The value is 
   * a string from the start.
   */
  const todoID = parseInt(request.params.id, 10);
  /**
   * I am using index as ID, if we know the position we can grab that value
   * directly.
   */
  const selectedItem = todos[todoID];
  res.send(selectedItem);
});

app.delete('/todos/:id', function (request, response) {
  //Convert to int from string 
  const todoID = parseInt(request.params.id, 10);
  /**
   * Filter the array of todos. Each iteration knows about the current
   * object being examined and the index of that object. If the index
   * is the same as the ID from the URL, do not return it. Filter will
   * return every item except the one with the ID that we are looking for
   */
  const filteredListOfTodos = todos.filter(function (todo, index){
    return index !== todoID;
  })
  /**
   * Failsafe, clone(spread syntax...) the array and overwrite the previous array
   * So we are replacing the original array with a whole new array
   * instead of manipulating the array directly. 
   */
  todos = [...filteredListOfTodos];
  response.send(todos);
});

app.patch('/todos/:id', function (request, response) {
  /**
   * A patch is like a post but will not create a new value only update
   * an exisiting one. This means that we need to send a body, the same
   * as with POST. But we also need the ID of the todo to be patched (updated)
   */
  const patchedTodo = request.body;
  const todoID = parseInt(request.params.id, 10);
  /**
   * We need to update a specific todo which means we need to 
   * mutate one of the items, this is a task for map and not filter or reduce.
   */
  const patchedListOfTodos = todos.map(function (todo, index){
    /**
     * Same as with delete,look for a specific index. If the index
     * is matched we will return the updated todo that is sent in BODY
     */
    if(index === todoID){
      return patchedTodo;
    }
    /**
     * If the item is not the index we are looking for, return the original todo.todoID
     * This means that only one of the items in the new array will be changed.
     */
    return todo;
  })
  todos = [...patchedListOfTodos];
  response.send(todos);
});


app.listen(4000);
