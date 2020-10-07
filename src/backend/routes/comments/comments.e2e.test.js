'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {commonParams} = require(`../../../common/params`);
const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const SALT_ROUND = +process.env.SALT_ROUND || commonParams.SALT_ROUND;
const PATH_TO_COMMENTS = `/api/comments`;
const PATH_TO_ARTICLES = `/api/articles`;
const PATH_TO_LOGIN = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;
const commentLimit = 5;
const articleData = {
  title: getRandomString(AVAILABLE_SYMBOLS, 40),
  image: `123.png`,
  announce: getRandomString(AVAILABLE_SYMBOLS, 40),
  text: getRandomString(AVAILABLE_SYMBOLS, 40),
  categories: [1, 2, 3],
  date: `2020-09-10`,
};
const commentData = {
  accountId: 1,
  text: getRandomString(AVAILABLE_SYMBOLS, 25),
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

const fillCommentsTable = async (count) => {
  const commentsForDbTable = Array(count).fill({}).map(() => ({
    text: getRandomString(AVAILABLE_SYMBOLS, 20),
    date: new Date(),
    accountId: 1,
    articleId: 1,
  }));
  await db.Comment.bulkCreate(commentsForDbTable)
    .catch((error) => showAccessError(error, `comments`));
};


describe(`Comments API end-points`, () => {
  let server = null;
  let article = null;
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

  beforeEach(async () => {
    const postArticleResponse = await request(server)
      .post(PATH_TO_ARTICLES)
      .set(`cookie`, adminCookie)
      .send(articleData);
    article = postArticleResponse.body;
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET comment list status code should be 200`, async () => {
      const res = await request(server).get(PATH_TO_COMMENTS);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET comment list by article id with not exist article status code should be 400`, async () => {
      await request(server)
        .delete(`${PATH_TO_ARTICLES}/${article.id}`)
        .set(`cookie`, adminCookie)
        .send();
      const res = await request(server).get(`${PATH_TO_COMMENTS}?articleId=${article.id}`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When GET comment list with limit status code should be 200`, async () => {
      const res = await request(server).get(`${PATH_TO_COMMENTS}?limit=${commentLimit}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET comment list with limit should return correct count of comments`, async () => {
      await fillCommentsTable(10);
      const res = await request(server).get(`${PATH_TO_COMMENTS}?limit=${commentLimit}`);
      expect(res.body.length).toBe(commentLimit);
    });
  });

  describe(`POST`, () => {
    test(`When POST article comment status code should be 201`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article comment without "text" property should have 400`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      delete comment.text;
      const postCommentResponse = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(postCommentResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test.each([`id`, `text`, `date`, `accountId`, `articleId`])(`When POST article comment should have %p property`, async (property) => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      const postCommentResponse = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(postCommentResponse.body).toHaveProperty(property);
    });



    test(`When POST article comment with invalid text when length is less then 20 status code should be 400`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,

        text: getRandomString(AVAILABLE_SYMBOLS, 19),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article comment with valid text when length is equal 20 status code should be 201`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 20),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });





    test(`When POST article comment with invalid text when length is great then 1000 status code should be 400`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,

        text: getRandomString(AVAILABLE_SYMBOLS, 1001),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article comment with valid text when length is equal 1000 status code should be 201`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 1000),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article comment without access token status code should be 401`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 500),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When POST article comment with not admin access token status code should be 201`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 500),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, userCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article comment with admin access token status code should be 201`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 500),
      };
      const res = await request(server)
        .post(PATH_TO_COMMENTS)
        .set(`cookie`, adminCookie)
        .send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });
  });
});
