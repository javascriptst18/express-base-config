const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportLocalMongoose = require('passport-local-mongoose');
const cors = require('cors');
const app = express();

mongoose.connect(
  'mongodb://javascriptst18:javascriptst18@ds125402.mlab.com:25402/javascriptst18',
  { useNewUrlParser: true }
); // Connect to mLab mongodb database

app.use(cors()); // Allow all domains to connect to the server
app.use(express.static('frontend/build')); // Deliver react-frontend
app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: true })); // So we can handle form-data from the user
app.use(cookieParser()); // saves cookies to request.cookies
app.use(session({
  secret: "asdasdasd",
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
app.use(passport.initialize()); // Tell express to use passport
app.use(passport.session()); // Tell passport to use session to save user 
passport.use(User.createStrategy()); // Tell passport to use standard strategy: email/password
passport.serializeUser(User.serializeUser()); // Hash/salt tactict
passport.deserializeUser(User.deserializeUser()); // hash/salt tactics

// Function for checking if user is allowed to visit an URL
function isLoggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next(); //next() means -> continue and forward request
  }
  response.status(401).json({
    type: 'ERROR',
    message: 'Unauthorized'
  }); // If user is not logged in, send json-error message
}

/**
 * passport.authenticate() will handle checking if the user exists
 * and if the user has the right credentials. If the login is
 * successful the request object will have a 'user'-property. This
 * user will be available in all requests inside of 'request.user'
 * Send both username and id to frontend. If login failed,
 * express will send a error message: Unauthorized
 */
app.post('/login', passport.authenticate('local'), (request, response) => {
  response.json({
    username: request.user.username,
    _id: request.user._id
  });
});

app.get('/logout', (request, response) => {
  // Passport function to remove session from server
  request.logout();
  // Could be a good idea to send a message as feedback to frontend
  response.json({
    type: 'SUCCESS',
    message: 'Logout successful'
  })
})

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
      response.status(500).json(err);
    }
    passport.authenticate('local')(request, response, () => {
      // Send a response-object if user is successfully registered
      response.json({
        type: 'SUCCESS',
        message: 'User registered'
      });
    });
  });
});

/**
 * THE TODO API
 */

const Todo = mongoose.model('Todo', {
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: 'false'
  },
  username: {
    type: String
  }
});

app.get('/', (request, response) => {
  response.sendFile('index');
});

app.get('/todos', (request, response) => {
  Todo.find({  })
    .then(documents => {
      response.json(documents);
    })
});

app.post('/todos', isLoggedIn, function (request, response) {
  const newTodo = new Todo({
    title: request.body.title,
    username: request.user.username
  });
  newTodo.save()
    .then(document => {
      response.json(document);
    });
});

app.get('/todos/:id', isLoggedIn, function (request, response) {
  Todo
    .findById(request.params.id)
    .then(document => {
      response.json(document);
    })
});

app.delete('/todos/:id', isLoggedIn, function (request, response) {
  Todo
    .findByIdAndRemove(request.params.id)
    .then(document => {
      response.json(document);
    })
});

app.patch('/todos/:id', isLoggedIn, function (request, response) {
  Todo.findByIdAndUpdate(request.params.id, {
    title: request.body.title
  }, { new: true })
    .then(document => {
      response.json(document);
    })
});

module.exports = app;