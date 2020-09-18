'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../index`);


const pathToComments = `/api/comments`;


const commentLimit = 5;

describe(`Comments API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When GET comment list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(pathToComments);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });
  test(`When GET comment list with limit status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${pathToComments}?limit=${commentLimit}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET comment list with limit should return correct count of comments`, async () => {
    const res = await request(server).get(`${pathToComments}?limit=${commentLimit}`);
    expect(res.body.length).toBe(commentLimit);
  });
});
