'use strict';

const bcrypt = require(`bcrypt`);
const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const pathToCategories = `/api/categories`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;
const authAdminParams = {
  email: `admin@mail.ru`,
  password: `123456`,
};
const authUserParams = {
  email: `user@mail.ru`,
  password: `654321`,
};

const initTest = async () => {
  await initDb(true);
  await createUsers();
};

const createUsers = async () => {
  return await db.Account.bulkCreate([
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authAdminParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authAdminParams.password, 10),
      isAdmin: true,
    },
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authUserParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authUserParams.password, 10),
      isAdmin: false,
    },
  ]);
};


describe(`Categories API end-points`, () => {
  let server = null;
  let adminCookie = null;
  let userCookie = null;

  beforeAll(async () => {
    await initTest();
    server = await apiContainer.getInstance();
    const admin = await request(server).post(pathToLogin).send(authAdminParams);
    adminCookie = admin.headers[`set-cookie`];
    const user = await request(server).post(pathToLogin).send(authUserParams);
    userCookie = user.headers[`set-cookie`];
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET categories status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(pathToCategories);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });

  describe(`POST`, () => {
    test(`When POST valid categories status code should be ${HttpCodes.CREATED}`, async () => {
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({title: `test test`});
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST empty object status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({});
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with invalid title when length is less then 5 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 4),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 5 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 5),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 31),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 30 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category without access token status code should be ${HttpCodes.UNAUTHORIZED}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 10),
      };
      const res = await request(server)
        .post(pathToCategories)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When POST category with not admin token status code should be ${HttpCodes.FORBIDDEN}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 10),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, userCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });
});
