const app = require('./server');

/**
 * .listen must be called so the server will start, without this function
 * the server will not listen for incoming request on port 4000. The console.log
 * is just a fancy message, it doesn't have to be there.
 */
app.listen(4000, () => {
  console.log("+---------------------------------------+");
  console.log("|                                       |");
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${4000} 🤖  \x1b[37m |`);
  console.log("|                                       |");
  console.log("\x1b[37m+---------------------------------------+");
});
