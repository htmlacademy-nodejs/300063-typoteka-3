'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const pathToComments = `/api/comments`;
const pathToArticles = `/api/articles`;
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
  text: `Новый комментарий`,
};

const initTest = async () => {
  await initDb(true);
  const categoriesForDbTable = new Array(5)
    .fill(``)
    .map(() => ({title: getRandomString(AVAILABLE_SYMBOLS, 10)}));

  const admin = {
    firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
    lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
    email: `admin@mail.ru`,
    avatar: `test.png`,
    password: bcrypt.hashSync(`123456`, 10),
    isAdmin: true,
  };
  await db.Category.bulkCreate(categoriesForDbTable);
  await db.Account.create(admin);
};


describe(`Comment API end-points`, () => {
  let server = null;
  let commentId = null;

  beforeAll(async () => {
    await initTest();
    server = await apiContainer.getInstance();
  });

  beforeEach(async () => {
    const postArticleResponse = await request(server).post(pathToArticles).send(articleData);
    const article = postArticleResponse.body;
    const postCommentResponse = await request(server).post(pathToComments).send({
      ...commentData,
      articleId: article.id,
    });
    commentId = postCommentResponse.body.id;
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  test(`When DELETE existed comment status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const res = await request(server).delete(`${pathToComments}/${commentId}`);
    expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE not existed comment status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${pathToComments}/${commentId}`);
    const res = await request(server).delete(`${pathToComments}/${commentId}`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE invalid comment id status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request(server).delete(`${pathToComments}/invalid-id`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });
});
