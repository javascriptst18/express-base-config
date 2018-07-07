const express = require('express'); // Import express package
/**
 * fetch is not a part of the JavaScript Core. It is a part of the Web APIs
 * only available in the browser and similar environments:
 * https://developer.mozilla.org/en-US/docs/Web/API
 * we need to install node-fetch or a similar tool to use fetch in node:
 * npm install node-fetch.
 * Two other very popular library for this is axios and request which
 * I both highly recommend to use, more easier to use than fetch:
 * https://github.com/axios/axios
 * https://github.com/request/request
 */
const fetch = require('node-fetch');
const app = express(); // Create our application
const PORT = 3000; //localhost:3000

app.use(express.static('public')) // All static files are sent from the public folder
app.use(express.json()); // So we can handle JSON-data from the user
app.use(express.urlencoded({ extended: false })); // So we can handle form-data from the user

app.get('/', function(request, response, error){
  response.sendFile('index.html'); // Send a html-file with the response
})

/**
 * Consume another API and call your own API with: http:localhost:3000/stockholm
 * Use 'request.query' to send along information to this request. This is not
 * necessary with Platsbanken because Platsbanken is completly open. But most
 * APIs on the web are built to be consumed this way. If you run into CORS-problems
 * you need to do this
 */
app.get('/stockholm', async function(request, response){
  const apiResponse = await fetch('http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1');
  const jsonData = await apiResponse.json();
  response.json(jsonData);
});

/** 
 * With then instead of async await. Async/await is only available
 * in newer versions of node.
 */
app.get('/then', function (request, response) {
  // Set a default lanid of 1 if no lanid is sent
  const lanid = request.query.lanid ? request.query.lanid : 1;
  fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=${lanid}`);
    .then(apiResponse => apiResponse.json())
    .then((jsonData) => {
      response.json(jsonData);
    })
})

app.listen(PORT); // Listen for incoming calls, keep the process open