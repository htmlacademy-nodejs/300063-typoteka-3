'use strict';

const {parse} = require(`cookie`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {getRandomString, getRandomEmail} = require(`../../utils`);
const {api} = require(`../index`);


const pathToUser = `/api/user`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

const password = getRandomString(AVAILABLE_SYMBOLS, 6);

const userDate = {
  firstname: getRandomString(AVAILABLE_SYMBOLS, 10),
  lastname: getRandomString(AVAILABLE_SYMBOLS, 10),
  email: getRandomEmail(100, [`ru`, `com`]),
  avatar: `${getRandomString(AVAILABLE_SYMBOLS, 10)}.png`,
  password,
  repeatedPassword: password,
};

const auth = {
  email: userDate.email,
  password: userDate.password,
};

describe(`Auth API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await api.getInstance();
    await request(server).post(pathToUser).send(userDate);
  });

  afterAll(async () => {
    await api.close();
    server = null;
  });

  test(`When POST auth with valid data status code should be ${HttpCodes.OK}`, async () => {
    const authRes = await request(server).post(pathToLogin).send(auth);
    expect(authRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST auth with not exist user status code should be ${HttpCodes.FORBIDDEN}`, async () => {
    const authData = {
      email: getRandomEmail(100, [`ru`, `com`]),
      password: getRandomString(AVAILABLE_SYMBOLS, 6),
    };
    const authRes = await request(server).post(pathToLogin).send(authData);
    expect(authRes.statusCode).toBe(HttpCodes.FORBIDDEN);
  });

  test(`When POST auth with invalid password status code should be ${HttpCodes.FORBIDDEN}`, async () => {
    const authData = {
      ...auth,
      password: getRandomString(AVAILABLE_SYMBOLS, 6),
    };
    const authRes = await request(server).post(pathToLogin).send(authData);
    expect(authRes.statusCode).toBe(HttpCodes.FORBIDDEN);
  });

  test.each(
    [`email`, `password`]
  )(`When POST auth data without %p field status code should be ${HttpCodes.BAD_REQUEST}`, async (propertyName) => {
    const authData = {...auth};
    delete authData[propertyName];
    const authRes = await request(server).post(pathToLogin).send(authData);
    expect(authRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each([`accessToken`, `refreshToken`])(`When POST auth with valid data should set %p cookie`, async (propertyName) => {
    const authRes = await request(server).post(pathToLogin).send(auth);
    const cookies = authRes.headers[`set-cookie`].map((cookie) => parse(cookie));
    const hasCookie = cookies.some((cookie) => Boolean(cookie[propertyName]));
    expect(hasCookie).toBeTruthy();
  });
});
