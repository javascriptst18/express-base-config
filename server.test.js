const app = require('./server');
const request = require('supertest');
const mongoose = require('mongoose');

describe('todo routes', () => {
  let cookie = '';

  /**
   * Our server depends on mongoose so we need to start a connection
   * to the databse. You should have a different test-database for this
   * purpose. We also need to make authenticated request. To do this we
   * login before the test and save the cookie we need to make all the 
   * other requests.
   */
  beforeAll((done) => {
    mongoose.connect('mongodb://javascriptst18:javascriptst18@ds125402.mlab.com:25402/javascriptst18', {
      useNewUrlParser: true 
    });
    request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'test'
      })
      .end((error, response) => {
        if (error) throw error;
        cookie = response.headers['set-cookie'];
        done();
      });
  });

  /**
   * Forces server to disconnect from server when all tests
   * are completed. Otherwise the test will not shut down because
   * the connection is stil open. Not working right now tho 🤔
   */
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
  });
})