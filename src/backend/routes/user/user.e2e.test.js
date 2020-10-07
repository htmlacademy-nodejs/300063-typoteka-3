'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);
const {initDb} = require(`../../db`);
const {getRandomString, getRandomEmail} = require(`../../utils`);


const PATH_TO_USER = `/api/user`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

const getUserDate = () => {
  const password = getRandomString(AVAILABLE_SYMBOLS, 6);
  return {
    firstname: getRandomString(AVAILABLE_SYMBOLS, 10),
    lastname: getRandomString(AVAILABLE_SYMBOLS, 10),
    email: getRandomEmail(100, [`ru`, `com`]),
    avatar: `${getRandomString(AVAILABLE_SYMBOLS, 10)}.png`,
    password,
    repeatedPassword: password,
  };
};

describe(`User API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    await initDb(true);
    server = await apiContainer.getInstance();
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  test(`When GET users status code should be 200`, async () => {
    const userDate = getUserDate();
    const postUserRes = await request(server).post(PATH_TO_USER).send(userDate);
    const getUsersRes = await request(server).get(`${PATH_TO_USER}/${postUserRes.body.id}`).send();
    expect(getUsersRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET user by id status code should be 400`, async () => {
    const getUsersRes = await request(server).get(`${PATH_TO_USER}/invalid-user-id`).send();
    expect(getUsersRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each(
    [`id`, `firstname`, `lastname`, `email`, `avatar`, `isAdmin`]
  )(`When GET user by id should return object with %p param`, async (propertyName) => {
    const userDate = getUserDate();
    const postUserRes = await request(server).post(PATH_TO_USER).send(userDate);
    const getUsersRes = await request(server).get(`${PATH_TO_USER}/${postUserRes.body.id}`).send();
    expect(getUsersRes.body).toHaveProperty(propertyName);
  });
});
