const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());

// Connection to db
mongoose.connect('mongodb://marcus:admin123@ds125392.mlab.com:25392/exercise-js18');

app.use(express.static('public'));

app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user

/* let todos = [
  {
    title: 'Learn Backend',
    completed: false
  },
  {
    title: 'Learn to learn',
    completed: true
  }
];
 */

// mongodb schema often in seperate file 
const Todo = mongoose.model('Todo', {
  title: String,
  completed: Boolean
});

/* app.get('/', function(request, response){
  response.sendFile('index.html');
}) */

app.get('/todos', function(request, response) {
  // Hämtar informationen
  // Kan söka med find ex Todo.find({ title: 'Learn Backend'})
  Todo.find({ }) 
    // documents valfritt namn
    .then((documents) => {
      // Skickar iväg informationen till användaren
      response.json(documents);
    })
});

// För att skapa och lägga till i db
// info från användaren hamnar alltid i body (request.body.title)
app.post('/todos', function (request, response) {
  const newTodo = new Todo({ title: request.body.title, completed: false});
  newTodo.save()
  // Efter vrje route måste man skicka ut med response för att få feedback
    .then(document => {
      response.json(document);
    })
});

app.get('/todos/:id', function (request, response) {
  // const todoID = parseInt(request.params.id, 10);
  const todoId = request.params.id.toString();
  Todo.find({ title: todoId })
    .then((document) => {
      response.json(document);
    })
});

app.delete('/todos/:id', function (request, response) {
  //Convert to int from string const todoID = parseInt(request.params.id, 10);
  
  const todoId = request.params.id.toString();
  Todo.findOneAndDelete({ title: todoId })
    .then((document) => {
      response.json(document);
    })
});

app.patch('/todos/:id', function (request, response) {
  const todoId = request.params.id.toString();
  const query = { title: todoId };
  Todo.findOneAndUpdate(query, { title: request.body.title })
    .then((document) => {
      response.json(document);
    })
});


app.listen(4000);
