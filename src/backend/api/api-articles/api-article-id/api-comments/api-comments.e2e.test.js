'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../../../index`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  createdAt: `2020-09-10`,
};

const commentData = {
  text: `Новый комментарий`,
};


describe(`Article comments API end-points`, () => {
  let article = null;
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  beforeEach(async () => {
    const articleRes = await request(server).post(pathToArticles).send(articleData);
    article = articleRes.body;
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When GET article comment list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${pathToArticles}/${article.id}/comments`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET article comment list by not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
    const res = await request(server).get(`${pathToArticles}/${article.id}/comments`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST article comment status code should be ${HttpCodes.CREATED}`, async () => {
    const res = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
  });

  test(`When POST article comment without "text" property should have ${HttpCodes.BAD_REQUEST}`, async () => {
    const comment = {...commentData};
    delete comment.text;
    const putArticleResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(comment);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each([`id`, `text`, `date`])(`When POST article comment should have %p property`, async (property) => {
    const putArticleResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
    expect(putArticleResponse.body).toHaveProperty(property);
  });

  test(`When POST article with invalid text when length is great then 1000 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const comment = {
      text: new Array(1001).fill(`i`).join(``),
    };
    const res = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(comment);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST article with valid text when length is equal 1000 status code should be ${HttpCodes.CREATED}`, async () => {
    const comment = {
      text: new Array(1000).fill(`i`).join(``),
    };
    const res = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(comment);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
  });
});
