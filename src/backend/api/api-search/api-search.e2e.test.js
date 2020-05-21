'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const mock = require(`backend/test-mock/data`);


describe(`Search API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
  });

  test(`When GET searched article list by title status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(encodeURI(`${mock.path.search}${article.title}`));
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET searched article list by title which not exist status code should be ${HttpCodes.NOT_FOUND}`, async () => {
    const articleListRes = await request(server).get(encodeURI(`${mock.path.search}${article.title}`));
    if (articleListRes.body.length !== 0) {
      await Promise.all(articleListRes.body.map((item) => request(server).delete(`${mock.path.article}/${item.id}`)));
    }
    const res = await request(server).get(encodeURI(`${mock.path.search}${article.title}`));
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
  });

  test(`When GET searched article list by title search should be case insensitive and status code should be ${HttpCodes.OK}`, async () => {
    const lowerTitle = article.title.toLowerCase();
    const lowerCaseSearchTitleRes = await request(server).get(encodeURI(`${mock.path.search}${lowerTitle}`));
    expect(lowerCaseSearchTitleRes.statusCode).toBe(HttpCodes.OK);
    const upperTitle = article.title.toUpperCase();
    const upperCaseSearchTitleRes = await request(server).get(encodeURI(`${mock.path.search}${upperTitle}`));
    expect(upperCaseSearchTitleRes.statusCode).toBe(HttpCodes.OK);
  });
});
