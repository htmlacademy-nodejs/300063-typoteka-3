'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const {articleParams} = require(`backend/adapters`);
const mock = require(`backend/test-mock/data`);


describe(`Article comments API end-points`, () => {


  test(`When GET article comment list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(mock.path.article);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });


});
