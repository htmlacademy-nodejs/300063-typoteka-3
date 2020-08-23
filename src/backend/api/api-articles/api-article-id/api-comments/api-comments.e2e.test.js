'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`../../../index`);
const {commentParams} = require(`../../../../adapters`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  createdDate: `2020-01-23 03:27:49`,
  categories: [`Разное`],
};

const commentData = {
  text: `Новый комментарий`,
};


describe(`Article comments API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
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

  test.each(commentParams.requestPropertyList)(`When POST article comment without %p property should have ${HttpCodes.BAD_REQUEST}`, async (property) => {
    const comment = {...commentData};
    delete comment[property];
    const putArticleResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(comment);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test.each(commentParams.responsePropertyList)(`When POST article comment should have %p property`, async (property) => {
    const putArticleResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
    expect(putArticleResponse.body).toHaveProperty(property);
  });
});
