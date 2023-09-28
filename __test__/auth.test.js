'use strict';

const { db } = require('../src/models');
const supertest = require('supertest');
const server = require('../src/server.js').server;

const mockRequest = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Auth Router', () => {
  let userData = {
    testUser: { username: 'user', password: 'password' },
  };

  beforeEach(() => {
    // Reset user data before each test
    userData = {
      testUser: { username: 'user', password: 'password' },
    };
  });

  it('Can create a new user', async () => {
    const response = await mockRequest
      .post('/api/auth/signup')
      .send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });

  it('Can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;
    const response = await mockRequest
      .post('/api/auth/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });
});

xdescribe('API Unauthenticated Endpoints', () => {
  describe('POST /api/v1/clothes', () => {
    let sampleObject = {
      name: 'shirt',
      color: 'yellow',
      size: 'small',
    };

    beforeEach(() => {
      // Reset sampleObject before each test
      sampleObject = {
        name: 'shirt',
        color: 'yellow',
        size: 'small',
      };
    });

    it('adds an item to the DB and returns an object with the added item', async () => {
      const response = await mockRequest
        .post('/api/v1/clothes')
        .send(sampleObject)
        .expect(201);

      // Assuming your response contains the newly created object
      expect(response.body).toEqual(expect.objectContaining(sampleObject));
    });
  });

  xdescribe('GET /api/v1/clothes', () => {
    it('returns a list of clothes items', async () => {
      const response = await mockRequest.get('/api/v1/clothes').expect(200);

      // Assuming your response contains an array of items
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  xdescribe('GET /api/v1/clothes/ID', () => {
    it('returns a single item by ID', async () => {
      // Assuming you have an existing item ID
      const itemId = 1;

      const response = await mockRequest
        .get(`/api/v1/clothes/${itemId}`)
        .expect(200);

      // Assuming your response contains the item with the specified ID
      expect(response.body).toEqual(expect.objectContaining({ id: itemId }));
    });
  });

  xdescribe('PUT /api/v1/clothes/ID', () => {
    it('returns a single, updated item by ID', async () => {
      // Assuming you have an existing item ID
      const itemId = 1;

      const response = await mockRequest
        .put(`/api/v1/clothes/${itemId}`)
        .send({
          name: 'pants',
          color: 'blue',
          size: 'medium',
        })
        .expect(200);

      // Assuming your response contains the updated item
      expect(response.body).toEqual(
        expect.objectContaining({ id: itemId, color: 'blue' })
      );
    });
  });

  xdescribe('DELETE /api/v1/clothes/ID', () => {
    it('returns an empty object and subsequent GET should result in nothing found', async () => {
      // Assuming you have an existing item ID
      const itemId = 1;

      // Delete the item
      await mockRequest.delete(`/api/v1/clothes/${itemId}`).expect(200);

      // Attempt to get the deleted item
      const getResponse = await mockRequest
        .get(`/api/v1/clothes/${itemId}`)
        .expect(200);

      // Check if the response body is null
      expect(getResponse.body).toBeNull();
    });
  });
});
