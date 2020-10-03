'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {commonParams} = require(`../../../common/params`);
const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const salt = +process.env.SALT_ROUND || commonParams.SALT_ROUND;
const pathToArticles = `/api/articles`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
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
  const categoriesForDbTable = new Array(5)
    .fill(``)
    .map(() => ({title: getRandomString(AVAILABLE_SYMBOLS, 10)}));
  await db.Category.bulkCreate(categoriesForDbTable);
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


describe(`Articles API end-points`, () => {
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
    test(`When GET article list status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(pathToArticles);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });

  describe(`POST`, () => {
    test(`When POST article status code should be ${HttpCodes.CREATED}`, async() => {
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(articleData);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
      await request(server).delete(`${pathToArticles}/${res.body.id}`);
    });

    test.each([`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When POST article should have %p property`, async(property) => {
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(articleData);
      expect(res.body).toHaveProperty(property);
      await request(server).delete(`${pathToArticles}/${res.body.id}`);
    });

    test.each([`title`, `announce`, `categories`, `date`])(`When POST article without %p property status code should be ${HttpCodes.BAD_REQUEST}`, async (property) => {
      const article = {...articleData};
      delete article[property];
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with invalid title when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.title = getRandomString(AVAILABLE_SYMBOLS, 29);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid title when length is equal 30 status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.title = getRandomString(AVAILABLE_SYMBOLS, 30);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid title when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.title = getRandomString(AVAILABLE_SYMBOLS, 251);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid title when length is equal 250 status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.title = getRandomString(AVAILABLE_SYMBOLS, 250);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid announce when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 29);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid announce when length is equal 30 status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 30);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid announce when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 251);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid announce when length is equal 250 status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 250);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid text when length is great then 1000 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.text = getRandomString(AVAILABLE_SYMBOLS, 1001);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid text when length is equal 1000 status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.text = getRandomString(AVAILABLE_SYMBOLS, 1000);
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with valid image extension status code should be ${HttpCodes.CREATED}`, async () => {
      const article = {...articleData};
      article.image = `123.png`;
      const resWithPng = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(resWithPng.statusCode).toBe(HttpCodes.CREATED);
      article.image = `123.jpg`;
      const resWithJpg = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(resWithJpg.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid image extension status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.image = `123.pmng`;
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with invalid date format status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const article = {...articleData};
      article.date = `10-09-2020`;
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article without access token status code should be ${HttpCodes.UNAUTHORIZED}`, async () => {
      const res = await request(server)
        .post(pathToArticles)
        .send(articleData);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When POST article with not admin access token status code should be ${HttpCodes.FORBIDDEN}`, async () => {
      const res = await request(server)
        .post(pathToArticles)
        .set(`cookie`, userCookie)
        .send(articleData);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });
});
