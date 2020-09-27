'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {getRandomString, getRandomEmail} = require(`../../utils`);
const {api} = require(`../index`);


const pathToUser = `/api/user`;
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
    server = await api.getInstance();
  });

  afterAll(async () => {
    await api.close();
    server = null;
  });

  test(`When GET users status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    const getUsersRes = await request(server).get(`${pathToUser}/${postUserRes.body.id}`).send();
    expect(getUsersRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET user by id status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const getUsersRes = await request(server).get(`${pathToUser}/invalid-user-id`).send();
    expect(getUsersRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each(
    [`id`, `firstname`, `lastname`, `email`, `avatar`, `isAdmin`]
  )(`When GET user by id should return object with %p param`, async (propertyName) => {
    const userDate = getUserDate();
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    const getUsersRes = await request(server).get(`${pathToUser}/${postUserRes.body.id}`).send();
    expect(getUsersRes.body).toHaveProperty(propertyName);
  });
});
