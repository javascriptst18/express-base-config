const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportLocalMongoose = require('passport-local-mongoose');
const cors = require('cors');
const app = express();

app.use(cors());

// Connection to db
mongoose.connect('mongodb://marcus:admin123@ds125392.mlab.com:25392/exercise-js18');

app.use(express.static('public'));

app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user

app.use(cookieParser()); // saves cookies to request.cookies
app.use(session({
  secret: "sshh",
  resave: true,
  saveUninitialized: false
})); // Initialise session in express, save who is logged in to the server

//Basic user has username and password, bare minimum
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

// passport-local-mongoose library that handles all login-logic,
// which means that we need to write less code
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

/**
 * Standard Passport configuration included in most
 * express-app that has authorization. We tell express
 * to use the library passport and to store the user
 * in a session. We also tell passport that we will
 * use a local strategy, which means that we will
 * use the regular username/password login
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Function for checking if user is allowed to visit an URL
function isLoggedIn(request, response, next){
  if (request.isAuthenticated()) {
    return next(); //next() means -> continue and forward request
  }
  response.json('Unauthorized');
}

/**
 * passport.authenticate() will handle checking if the user exists
 * and if the user has the right credentials. If the login is
 * successful the request object will have a 'user'-property. This
 * user will be available in all requests inside of 'request.user'
 */
app.post('/login', passport.authenticate('local'), (request, response) => {
  response.json(request.user.username);
});

/**
 * We are creating a new user like we did with Todo, but because of
 * passport we need to call the function User.register. If the user
 * already exists we will get an error, if the registration is successful
 * we can either send back the user or like in this case say that
 * the register is successful
 */
app.post('/register', (request, response) => {
  User.register(new User({ username: request.body.username }), request.body.password, (err, user) => {
    if (err) {
      response.json(err);
    }
    passport.authenticate('local')(request, response, () => {
      response.json('User registered');
    });
  });
});

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
