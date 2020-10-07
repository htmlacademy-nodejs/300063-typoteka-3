'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);


const pathToCheck = `/api/check/server`;

describe(`Articles API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiContainer.getInstance();
  });

  test(`When GET check status code should be 200`, async () => {
    const checkRes = await request(server).get(pathToCheck);
    expect(checkRes.statusCode).toBe(HttpCodes.OK);
  })
});
