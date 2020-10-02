'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../index`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
};


describe(`Articles API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test.only(`When GET article list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(pathToArticles);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST article status code should be ${HttpCodes.CREATED}`, async() => {
    const res = await request(server).post(pathToArticles).send(articleData);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
    await request(server).delete(`${pathToArticles}/${res.body.id}`);
  });

  test.each([`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When POST article should have %p property`, async(property) => {
    const res = await request(server).post(pathToArticles).send(articleData);
    expect(res.body).toHaveProperty(property);
    await request(server).delete(`${pathToArticles}/${res.body.id}`);
  });

  test.skip.each([`title`, `image`, `announce`, `text`, `categories`])(`When POST article without %p property status code should be ${HttpCodes.BAD_REQUEST}`, async (property) => {
    const article = {...articleData};
    delete article[property];
    const res = await request(server).post(pathToArticles).send(article);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });
});
