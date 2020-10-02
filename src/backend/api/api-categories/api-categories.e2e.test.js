'use strict';

const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const apiServer = require(`../index`);


describe(`Categories API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When GET categories status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server)
      .get(`/api/categories`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });
});
