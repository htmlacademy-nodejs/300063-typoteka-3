'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {commonParams} = require(`../../../common/params`);
const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const SALT_ROUND = +process.env.SALT_ROUND || commonParams.SALT_ROUND;
const PATH_TO_ARTICLES = `/api/articles`;
const PATH_TO_LOGIN = `/api/user/login`;
const PATH_TO_CATEGORIES = `/api/categories`;
const PATH_TO_COMMENTS = `/api/comments`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;
const authAdminParams = {
  email: `admin@mail.ru`,
  password: `123456`,
};
const authUserParams = {
  email: `user@mail.ru`,
  password: `654321`,
};

const getArticles = (count, categories = [1, 2, 3]) => (
  Array(count).fill({}).map(() => ({
    title: getRandomString(AVAILABLE_SYMBOLS, 40),
    image: `123.png`,
    announce: getRandomString(AVAILABLE_SYMBOLS, 40),
    text: getRandomString(AVAILABLE_SYMBOLS, 40),
    categories,
    date: `2020-09-10`,
  }))
);


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
      password: bcrypt.hashSync(authAdminParams.password, SALT_ROUND),
      isAdmin: true,
    },
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authUserParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authUserParams.password, SALT_ROUND),
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
    const admin = await request(server).post(PATH_TO_LOGIN).send(authAdminParams);
    adminCookie = admin.headers[`set-cookie`];
    const user = await request(server).post(PATH_TO_LOGIN).send(authUserParams);
    userCookie = user.headers[`set-cookie`];
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET article list status code should be 200`, async () => {
      const res = await request(server).get(PATH_TO_ARTICLES);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET article with title query param status code should be 200`, async () => {
      const article = getArticles(1)[0];
      await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      const res = await request(server).get(`${PATH_TO_ARTICLES}?title=${article.title}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET article with title query param status have greater than 0 publications`, async () => {
      const article = getArticles(1)[0];
      await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      const res = await request(server).get(`${PATH_TO_ARTICLES}?title=${article.title}`);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test(`When GET article with limit query param should return specified quantity publications`, async () => {
      await Promise.all(getArticles(10).map((article) => request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article)
      ));
      const limit = 8;
      const res = await request(server).get(`${PATH_TO_ARTICLES}?limit=${limit}`);
      expect(res.body.list).toHaveLength(limit);
    });

    test(`When GET article without limit query param status code should be 200`, async () => {
      await Promise.all(getArticles(10).map((article) => request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article)
      ));
      const res = await request(server).get(PATH_TO_ARTICLES);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET article with page query param but without limit one status code should be 400`, async () => {
      const res = await request(server).get(`${PATH_TO_ARTICLES}?page=${1}`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When GET article with page and limit query params status code should be 200`, async () => {
      const limit = 8;
      const res = await request(server).get(`${PATH_TO_ARTICLES}?page=${1}&limit=${limit}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET article with page and limit query params should return last publications`, async () => {
      await Promise.all(getArticles(10).map((article) => request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article)
      ));
      const allArticlesRes = await request(server).get(PATH_TO_ARTICLES);
      const limit = 8;
      const lastPage = Math.ceil(allArticlesRes.body.length / limit);
      const countLastArticles = allArticlesRes.body.length % limit;
      const res = await request(server).get(`${PATH_TO_ARTICLES}?page=${countLastArticles !== 0 ? lastPage : lastPage + 1}&limit=${limit}`);
      expect(res.body.list).toHaveLength(countLastArticles);
    });

    test(`When GET article with category should return existed publication with specified category`, async () => {
      const articleWithNewCategoryCount = 2;
      const categoryRes = await request(server)
        .post(PATH_TO_CATEGORIES)
        .set(`cookie`, adminCookie)
        .send({title: getRandomString(AVAILABLE_SYMBOLS, 15)});
      const newCategoryId = categoryRes.body.id;
      const articlesDate = getArticles(1);
      const articlesDateWithNewCategory = getArticles(articleWithNewCategoryCount, [newCategoryId]);
      const promisifyArticles = [...articlesDate, ...articlesDateWithNewCategory].map((article) => request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article)
      );
      await Promise.all(promisifyArticles);
      const res = await request(server).get(`${PATH_TO_ARTICLES}?category=${newCategoryId}`);
      expect(res.body.list).toHaveLength(articleWithNewCategoryCount);
    });

    test(`When GET article with minCommentCount param status code should be 200`, async () => {
      const res = await request(server).get(`${PATH_TO_ARTICLES}?minCommentCount=1`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET article with minCommentCount param should return publication with comments`, async () => {
      const article = getArticles(1)[0];
      const articleRes = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      const commentData = {
        accountId: 1,
        articleId: articleRes.body.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 25),
      };
      await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, adminCookie)
        .send(commentData);
      const res = await request(server).get(`${PATH_TO_ARTICLES}?minCommentCount=1`);
      expect(res.body.list).toHaveLength(1);
    });
  });

  describe(`POST`, () => {
    test(`When POST article status code should be 201`, async() => {
      const article = getArticles(1)[0];
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
      await request(server).delete(`${PATH_TO_ARTICLES}/${res.body.id}`);
    });

    test.each([`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When POST article should have %p property`, async(property) => {
      const article = getArticles(1)[0];
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.body).toHaveProperty(property);
      await request(server).delete(`${PATH_TO_ARTICLES}/${res.body.id}`);
    });

    test.each([`title`, `announce`, `categories`, `date`])(`When POST article without %p property status code should be 400`, async (property) => {
      const article = getArticles(1)[0];
      delete article[property];
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with invalid title when length is less then 30 status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.title = getRandomString(AVAILABLE_SYMBOLS, 29);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid title when length is equal 30 status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.title = getRandomString(AVAILABLE_SYMBOLS, 30);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid title when length is great then 250 status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.title = getRandomString(AVAILABLE_SYMBOLS, 251);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid title when length is equal 250 status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.title = getRandomString(AVAILABLE_SYMBOLS, 250);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid announce when length is less then 30 status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 29);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid announce when length is equal 30 status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 30);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid announce when length is great then 250 status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 251);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid announce when length is equal 250 status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.announce = getRandomString(AVAILABLE_SYMBOLS, 250);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid text when length is great then 1000 status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.text = getRandomString(AVAILABLE_SYMBOLS, 1001);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid text when length is equal 1000 status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.text = getRandomString(AVAILABLE_SYMBOLS, 1000);
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with valid image extension status code should be 201`, async () => {
      const article = getArticles(1)[0];
      article.image = `123.png`;
      const resWithPng = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(resWithPng.statusCode).toBe(HttpCodes.CREATED);
      article.image = `123.jpg`;
      const resWithJpg = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(resWithJpg.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article with invalid image extension status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.image = `123.pmng`;
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with invalid date format status code should be 400`, async () => {
      const article = getArticles(1)[0];
      article.date = `10-09-2020`;
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, adminCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article without access token status code should be 401`, async () => {
      const article = getArticles(1)[0];
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When POST article with not admin access token status code should be 403`, async () => {
      const article = getArticles(1)[0];
      const res = await request(server)
        .post(PATH_TO_ARTICLES)
        .set(`cookie`, userCookie)
        .send(article);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });
});
