'use strict';

const { db } = require('../src/models');
const supertest = require('supertest');
const server = require('../src/server.js').server;

const request = supertest(server);

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe(' Testing our auth server', () => {
  test('Will this return a 500 error - bad model', async () => {
    let response = await request.get('/notAnEndpoint');

    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual(
      'Invalid Model',
    );
  });

  test('Will this return a 404 error - bad method ', async () => {
    let response = await request.patch('/signin');

    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual(
      'Sorry, we could not find what you were looking for');
  });
});
