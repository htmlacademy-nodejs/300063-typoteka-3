'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`../index`);


const pathToArticles = `/api/articles`;
const pathToSearch = `/api/search?title=`;

const articleData = {
  title: `Обзор новейшего смартфона`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  createdDate: `2020-01-23 03:27:49`,
  categories: [`Разное`],
};


describe(`Search API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
  });

  test(`When GET searched article list by title status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(encodeURI(`${pathToSearch}${article.title}`));
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET searched article list by title which not exist status code should be ${HttpCodes.NOT_FOUND}`, async () => {
    const articleListRes = await request(server).get(encodeURI(`${pathToSearch}${article.title}`));
    if (articleListRes.body.length !== 0) {
      await Promise.all(articleListRes.body.map((item) => request(server).delete(`${pathToArticles}/${item.id}`)));
    }
    const res = await request(server).get(encodeURI(`${pathToSearch}${article.title}`));
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
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
