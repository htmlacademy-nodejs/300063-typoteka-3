'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {commonParams} = require(`../../../common/params`);
const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const salt = +process.env.SALT_ROUND || commonParams.SALT_ROUND;
const pathToComments = `/api/comments`;
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


describe(`Comment API end-points`, () => {
  let server = null;
  let commentId = null;
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

  beforeEach(async () => {
    const postArticleResponse = await request(server)
      .post(pathToArticles)
      .set(`cookie`, adminCookie)
      .send(articleData);
    const article = postArticleResponse.body;
    const postCommentResponse = await request(server)
      .post(pathToComments)
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

  test(`When DELETE existed comment status code should be 204`, async () => {
    const res = await request(server)
      .delete(`${pathToComments}/${commentId}`)
      .set(`cookie`, adminCookie);
    expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE not existed comment status code should be 400`, async () => {
    await request(server)
      .delete(`${pathToComments}/${commentId}`)
      .set(`cookie`, adminCookie);
    const res = await request(server)
      .delete(`${pathToComments}/${commentId}`)
      .set(`cookie`, adminCookie);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE invalid comment id status code should be 400`, async () => {
    const res = await request(server)
      .delete(`${pathToComments}/invalid-id`)
      .set(`cookie`, adminCookie);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE comment without access token status code should be 401`, async () => {
    const res = await request(server).delete(`${pathToComments}/${commentId}`);
    expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
  });

  test(`When DELETE comment with not admin access token status code should be 403`, async () => {
    const res = await request(server)
      .delete(`${pathToComments}/${commentId}`)
      .set(`cookie`, userCookie);
    expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
  });
});
