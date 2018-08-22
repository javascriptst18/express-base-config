const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

mongoose.connect(
  'mongodb://javascriptst18:javascriptst18@ds125402.mlab.com:25402/javascriptst18'
);

app.use(express.static('frontend/build'));

app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user

const Todo = mongoose.model('Todo', {
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: 'false'
  }
});

// ReST API

app.get('/', (request, response ) => {
  response.sendFile('index');
});

app.get('/todos', async (request, response) => {
  const documents = await Todo.find({})
  response.json(documents);
});

app.post('/todos', function (request, response) {
  const newTodo = new Todo({ title: request.body.title });
  newTodo.save()
    .then(document => {
      response.json(document);
    });
});

app.get('/todos/:id', function (request, response) {
  Todo
    .findById(request.params.id)
    .then(document => {
      response.json(document);
    })
});

app.delete('/todos/:id', function (request, response) {
  Todo
    .findByIdAndRemove(request.params.id)
    .then(document => {
      response.json(document);
    })
});

app.patch('/todos/:id', function (request, response) {
  Todo.findByIdAndUpdate(request.params.id, {
    title: request.body.title
  })
  .then(document => {
    response.json(document);
  })
});


app.listen(4000);
