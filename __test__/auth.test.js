'use strict';

const { db } = require('../src/models');
const supertest = require('supertest');
const server = require('../src/server.js').server;
const User = require('../src/auth/models/users.js');


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
      .post('/signup')
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
      .post('/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });
});

const roles = ['user', 'writer', 'admin'];

describe('Auth Router', () => {
  // ... rest of your code ...

  const roles = ['user', 'writer', 'admin'];

  roles.forEach(role => {

    describe(`Role: ${role}`, () => {
      let userData = {
        [role]: { username: role, password: 'password', role: role },
      };

      it(`Can create a new ${role}`, async () => {
        // ... as before
      });

      it(`Can signin ${role} with basic auth string`, async () => {
        // ... as before
      });

      it(`Can authenticate ${role}'s token`, async () => {
        // First sign-in to get the token
        let { username, password } = userData[role];
        const signinResponse = await mockRequest
          .post('/signin')
          .auth(username, password);

        const token = signinResponse.body.token;

        // Use your model's method to authenticate token
        const user = await User.authenticateToken(token);
        expect(user.username).toEqual(username);
        expect(user.role).toEqual(role);
      });
    });
  });
});

