'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const {articleParams} = require(`backend/adapters`);
const mock = require(`backend/test-mock/data`);


describe(`Article ID API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
  });

  test(`When GET exist article by ID status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${mock.path.article}/${article.id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.responsePropertyList)(`When GET exist article by ID should have %p property`, async (property) => {
    const res = await request(server).get(`${mock.path.article}/${article.id}`);
    expect(res.body).toHaveProperty(property);
  });

  test(`When DELETE article status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${article.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${article.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE not exist article response should has "empty" property`, async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${article.id}`);
    expect(removeArticleResponse.body).toHaveProperty(`message`);
  });

  test(`When PUT article params status code should be ${HttpCodes.OK}`, async () => {
    const putArticleResponse = await request(server).put(`${mock.path.article}/${article.id}`).send(mock.article.newDate);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article without %p property status code should be ${HttpCodes.OK}`, async (property) => {
    const articleParams = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${article.id}`).send(articleParams);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.responsePropertyList)(`When PUT article should has %p property`, async (property) => {
    const articleParams = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body).toHaveProperty(property);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article should has transmitted value for %p property`, async (property) => {
    const articleParams = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body[property]).toEqual(mock.article.newDate[property]);
  });
});
