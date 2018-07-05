const express = require('express'); // Import express package
const app = express(); // Create our application
const PORT = 3000; //localhost:3000

app.use(express.static('public')) // All static files are sent from the public folder
app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: false })); // So we can handle form-data from the user

app.get('/', function(request, response, error){
  response.sendFile('index.html'); // Send a html-file with the response
})

app.listen(PORT); // Listen for incoming calls, keep the process open