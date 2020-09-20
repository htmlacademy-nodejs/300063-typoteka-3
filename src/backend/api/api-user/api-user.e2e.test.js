'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../index`);


const pathToUser = `/api/user`;

const getRandomNumber = (length) => {
  const randomNumber = 1 + Math.random();
  return `${Math.ceil(randomNumber * Math.pow(10, length - 1))}`;
};

const getRandomEmail = (length = 10) => {
  if (length <= 6) {
    console.error(`Email должен содержать минимум 7 символов`);
  }
  let firstPartLength;
  let secondPartLength = 6;
  if (length >= 70) {
    firstPartLength = 64;
    secondPartLength = length - firstPartLength;
  } else {
    firstPartLength = length - secondPartLength;
  }
  let randomPart = 20;
  if (firstPartLength <= randomPart) {
    randomPart = firstPartLength;
    firstPartLength = 0;
  } else {
    firstPartLength = firstPartLength - randomPart;
  }

  const firstPartEmail = getRandomNumber(randomPart) + new Array(firstPartLength).fill(`i`).join(``);
  const secondPartEmail = new Array(secondPartLength - 5).fill(`i`).join(``);
  return `${firstPartEmail}@${secondPartEmail}.com`;
};

const getUserDate = () => {
  return {
    firstname: `testFirstname`,
    lastname: `testLastname`,
    email: getRandomEmail(100),
    avatar: `avatar-1.png`,
    password: `123456`,
    repeatedPassword: `123456`,
  };
};

describe(`User API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When POST user with valid data status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test.each(
    [`firstname`, `lastname`, `email`, `password`, `repeatedPassword`]
  )(`When POST user without %p field data status code should be ${HttpCodes.BAD_REQUEST}`, async (propertyName) => {
    const userDate = getUserDate();
    delete userDate[propertyName];
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each(
    [`firstname`, `lastname`, `email`, `password`, `repeatedPassword`]
  )(`When POST user without %p field data status code should be ${HttpCodes.BAD_REQUEST}`, async (propertyName) => {
    const userDate = getUserDate();
    userDate[propertyName] = ``;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with invalid symbols in "firstname" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.firstname = `invalid-firstname`;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with max length "firstname" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.firstname = new Array(50).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with too long "firstname" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.firstname = new Array(51).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with invalid symbols in "lastname" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.lastname = `invalid-lastname`;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with max length "lastname" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.lastname = new Array(50).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with too long "lastname" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.lastname = new Array(51).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with invalid "email" pattern status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.email = `invalid-email`;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with max length "email" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.email = getRandomEmail(100);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with too long "email" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.email = userDate.email = getRandomEmail(101);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with exist email status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    await request(server).post(pathToUser).send(userDate);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user without "avatar" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    delete userDate.avatar;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with empty "avatar" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.avatar = ``;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with max length "avatar" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.avatar = `${new Array(96).fill(`i`).join(``)}.jpg`;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with too long "avatar" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.avatar = `${new Array(97).fill(`i`).join(``)}.jpg`;
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with min length "password" field status code should be ${HttpCodes.OK}`, async () => {
    const userDate = getUserDate();
    userDate.password = new Array(6).fill(`i`).join(``);
    userDate.repeatedPassword = new Array(6).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST user with too short "password" field status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.password = new Array(5).fill(`i`).join(``);
    userDate.repeatedPassword = new Array(5).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST user with different "password" and "repeatedPassword" status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const userDate = getUserDate();
    userDate.password = new Array(6).fill(`i`).join(``);
    userDate.repeatedPassword = new Array(7).fill(`i`).join(``);
    const postUserRes = await request(server).post(pathToUser).send(userDate);
    expect(postUserRes.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });
});
