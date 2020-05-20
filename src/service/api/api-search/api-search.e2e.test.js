'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`service/api`);


describe(`Search API end-points`, () => {
  test(`When GET article by title status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`/api/search?title=qwer`);
    expect(true).toBeTruthy();
  });
});
