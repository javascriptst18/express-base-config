const app = require('./server');
const request = require('supertest');
const mongoose = require('mongoose');

describe('Express server', () => {
  let cookie = '';

  beforeAll(async () => {
    // Connect to database before doing tests
    mongoose.connect('mongodb://javascriptst18:javascriptst18@ds125402.mlab.com:25402/javascriptst18', { useNewUrlParser: true });
    
    /**
     * Login before all tests so we can call even the protected routes.
     * The cookie is sent in the requests headers, I am saving that value
     * globally in this test file so we can use it in later requests
     */
    const response = await request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'test'
      });

    cookie = response.headers['set-cookie'];
  });

  afterAll(async () => {
    /**
     * Shut it down when all is done
     */
    await mongoose.connection.close();
    await mongoose.disconnect();

  });

  it('GET /todos', () => {
    /**
     * We can either return the request or we can use async await.
     * because we are making an authed request we need to set the cookie
     * so supertest knows that we have logged in.
     */
    return request(app)
      .get('/todos')
      .set('cookie', cookie)
      .expect(200)

  });

  it('POST /todos', async () => {

    const response = await request(app)
      .post('/todos')
      .send({ title: 'More tests please' })
      .set('cookie', cookie)
      .expect(200);

    expect(response.body.title).toBe('More tests please');

  })

  it('DELETE /todos/:id', async () => {
    /**
     * To have an todo to delete we need an ID, this is solved
     * by creating a todo first using supertest. We can then use
     * the ID of this todo to delete it and the assert that the id
     * of the created todo and the deleted todo is the same.
     * async/await is used because it is easier to see instead of 
     * a bunch of .then callbacks
     */
    const createdTodo = await request(app)
      .post('/todos')
      .send({ title: 'More tests please' })
      .set('cookie', cookie)
      .expect(200);

    const deletedTodo = await request(app)
      .delete(`/todos/${createdTodo.body._id}`)
      .set('cookie', cookie)
      .expect(200);

    expect(deletedTodo.body._id).toBe(createdTodo.body._id);

  })

  it('GET /todos/:id', async () => {

    /**
     * Same tactics as with DELETE; create a todo first, then find it
     */
    const createdTodo = await request(app)
      .post('/todos')
      .send({ title: 'More tests please' })
      .set('cookie', cookie)
      .expect(200);

    const findById = await request(app)
      .get(`/todos/${createdTodo.body._id}`)
      .set('cookie', cookie)
      .expect(200);

    expect(createdTodo.body._id).toBe(findById.body._id);
  });

  it('PATCH /todos/:id', async () => {

    /**
     * Same tactics as with DELETE; create a todo first, then modify it
     */
    const createdTodo = await request(app)
      .post('/todos')
      .send({ title: 'More tests please' })
      .set('cookie', cookie)
      .expect(200);

    const patchById = await request(app)
      .patch(`/todos/${createdTodo.body._id}`)
      .send({ title: 'New title'})
      .set('cookie', cookie)
      .expect(200);

    // Assert that the title has been changed
    expect(patchById.body.title).toBe('New title');

  })
})