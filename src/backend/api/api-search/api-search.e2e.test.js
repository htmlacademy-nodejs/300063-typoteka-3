'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../index`);


const pathToArticles = `/api/articles`;
const pathToSearch = `/api/search?title=`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  createdAt: `2020-09-10`,
};


describe(`Search API end-points`, () => {
  let server = null;
  let article = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When GET searched article list by title status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(encodeURI(`${pathToSearch}${article.title}`));
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET searched article list by title search should be case insensitive and status code should be ${HttpCodes.OK}`, async () => {
    const lowerTitle = article.title.toLowerCase();
    const lowerCaseSearchTitleRes = await request(server).get(encodeURI(`${pathToSearch}${lowerTitle}`));
    expect(lowerCaseSearchTitleRes.statusCode).toBe(HttpCodes.OK);
    const upperTitle = article.title.toUpperCase();
    const upperCaseSearchTitleRes = await request(server).get(encodeURI(`${pathToSearch}${upperTitle}`));
    expect(upperCaseSearchTitleRes.statusCode).toBe(HttpCodes.OK);
  });
});
