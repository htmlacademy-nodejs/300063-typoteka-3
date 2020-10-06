'use strict';

const bcrypt = require(`bcrypt`);
const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const {commonParams} = require(`../../../common/params`);
const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const salt = +process.env.SALT_ROUND || commonParams.SALT_ROUND;
const pathToArticles = `/api/articles`;
const pathToCategories = `/api/categories`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;
const articleData = {
  title: getRandomString(AVAILABLE_SYMBOLS, 40),
  image: `123.png`,
  announce: getRandomString(AVAILABLE_SYMBOLS, 40),
  text: getRandomString(AVAILABLE_SYMBOLS, 40),
  categories: [1, 2, 3],
  date: `2020-09-10`,
};
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
      password: bcrypt.hashSync(authAdminParams.password, salt),
      isAdmin: true,
    },
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authUserParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authUserParams.password, salt),
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
    test(`When GET categories status code should be 200`, async () => {
      const res = await request(server).get(pathToCategories);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET categories with minArticleCount status code should be 200`, async () => {
      const res = await request(server).get(`${pathToCategories}?minArticleCount=5`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET categories with articleId status code should be 200`, async () => {
      const categoryRes = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({
          title: getRandomString(AVAILABLE_SYMBOLS, 15),
        });
      const article = {
        ...articleData,
        categories: [categoryRes.body.id],
      };
      const articleRes = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      const res = await request(server).get(`${pathToCategories}?articleId=${articleRes.body.id}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET categories with articleId should have categories`, async () => {
      const categoryRes1 = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({
          title: getRandomString(AVAILABLE_SYMBOLS, 15),
        });
      const categoryRes2 = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({
          title: getRandomString(AVAILABLE_SYMBOLS, 15),
        });
      const article = {
        ...articleData,
        categories: [categoryRes1.body.id, categoryRes2.body.id],
      };
      const articleRes = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      const res = await request(server).get(`${pathToCategories}?articleId=${articleRes.body.id}`);
      expect(res.body).toHaveLength(2);
    });
  });

  describe(`POST`, () => {
    test(`When POST valid categories status code should be 201`, async () => {
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({title: `test test`});
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST empty object status code should be 400`, async () => {
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send({});
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with invalid title when length is less then 5 status code should be 400`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 4),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 5 status code should be 201`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 5),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category with invalid title when length is great then 30 status code should be 400`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 31),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 30 status code should be 201`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category without access token status code should be 401`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 10),
      };
      const res = await request(server)
        .post(pathToCategories)
        .send(category);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When POST category with not admin token status code should be 403`, async () => {
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
