'use strict';

const {parse} = require(`cookie`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);
const {initDb} = require(`../../db`);
const {getRandomString, getRandomEmail} = require(`../../utils`);


const pathToUser = `/api/user`;
const pathToLogin = `/api/user/login`;
const pathToLogout = `/api/user/logout`;
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
  let server;
  let cookies;

  beforeAll(async () => {
    await initDb(true);
    server = await apiContainer.getInstance();
    await request(server).post(pathToUser).send(userDate);
  });

  beforeEach(async () => {
    const postAuthRes = await request(server).post(pathToLogin).send(auth);
    cookies = postAuthRes.headers[`set-cookie`];
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  test(`When POST logout with valid refresh token status code should be 204`, async () => {
    const logoutRes = await request(server)
      .post(pathToLogout)
      .set('cookie', cookies)
      .send();
    expect(logoutRes.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When POST logout without refresh token status code should be 400`, async () => {
    const newCookies = cookies.filter((cookie) => !cookie.match(`refreshToken`));
    const logoutRes = await request(server)
      .post(pathToLogout)
      .set('cookie', newCookies)
      .send();
    expect(logoutRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST logout with empty refresh token status code should be 400`, async () => {
    const newCookies = cookies.map((cookie) => cookie.match(`refreshToken`) ? `refreshToken=; Path=/` : cookie);
    const logoutRes = await request(server)
      .post(pathToLogout)
      .set('cookie', newCookies)
      .send();
    expect(logoutRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST logout without access token status code should be 401`, async () => {
    const newCookies = cookies.filter((cookie) => !cookie.match(`accessToken`));
    const logoutRes = await request(server)
      .post(pathToLogout)
      .set('cookie', newCookies)
      .send();
    expect(logoutRes.statusCode).toBe(HttpCodes.UNAUTHORIZED);
  });

  test(`When POST logout with invalid access token status code should be 401`, async () => {
    const newCookies = cookies.map((cookie) => cookie.match(`accessToken`) ? `accessToken=not-exist-token; Path=/` : cookie);
    const logoutRes = await request(server).post(pathToLogout)
      .set('cookie', newCookies)
      .send();
    expect(logoutRes.statusCode).toBe(HttpCodes.UNAUTHORIZED);
  });

  test.each([`accessToken`, `refreshToken`])(`When POST logout with valid data should delete %p cookie`, async (propertyName) => {
    const logoutRes = await request(server)
      .post(pathToLogout)
      .set('cookie', cookies)
      .send(auth);
    const responseCookies = logoutRes.headers[`set-cookie`].map((cookie) => parse(cookie));
    const hasCookie = responseCookies.some((cookie) => {
      if (cookie[propertyName] !== undefined) {
        return cookie.Expires === new Date(0).toGMTString();
      }
    });
    expect(hasCookie).toBeTruthy();
  });
});
