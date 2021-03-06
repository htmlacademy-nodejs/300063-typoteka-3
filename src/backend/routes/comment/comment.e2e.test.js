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
const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
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


describe(`Comment API end-points`, () => {
  let server = null;
  let commentId = null;
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
    const article = postArticleResponse.body;
    const postCommentResponse = await request(server)
      .post(PATH_TO_COMMENTS)
      .set(`cookie`, userCookie)
      .send({
        ...commentData,
        articleId: article.id,
      });
    commentId = postCommentResponse.body.id;
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET existed comment status code should be 200`, async () => {
      const res = await request(server)
        .get(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, userCookie);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET doesn't exist comment status code should be 400`, async () => {
      await request(server)
        .delete(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, adminCookie);
      const res = await request(server)
        .get(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, userCookie);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test.each([`id`, `text`, `date`, `account`, `article`])(`When GET article comment should have %p property`, async (property) => {
      const postCommentResponse = await request(server)
        .get(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, userCookie);
      expect(postCommentResponse.body).toHaveProperty(property);
    });
  });

  describe(`DELETE`, () => {
    test(`When DELETE existed comment status code should be 204`, async () => {
      const res = await request(server)
        .delete(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, adminCookie);
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });

    test(`When DELETE not existed comment status code should be 400`, async () => {
      await request(server)
        .delete(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, adminCookie);
      const res = await request(server)
        .delete(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, adminCookie);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE invalid comment id status code should be 400`, async () => {
      const res = await request(server)
        .delete(`${PATH_TO_COMMENTS}/invalid-id`)
        .set(`cookie`, adminCookie);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE comment without access token status code should be 401`, async () => {
      const res = await request(server).delete(`${PATH_TO_COMMENTS}/${commentId}`);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When DELETE comment with not admin access token status code should be 403`, async () => {
      const res = await request(server)
        .delete(`${PATH_TO_COMMENTS}/${commentId}`)
        .set(`cookie`, userCookie);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });
});
