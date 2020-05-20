'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const mock = require(`backend/test-mock/data`);
const {commentParams} = require(`backend/adapters`);


describe(`Article comments API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
  });

  test(`When GET article comment list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${mock.path.article}/${article.id}/comments`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When GET article comment list by not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
    const res = await request(server).get(`${mock.path.article}/${article.id}/comments`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When POST article comment status code should be ${HttpCodes.CREATED}`, async () => {
    const res = await request(server).post(`${mock.path.article}/${article.id}/comments`).send(mock.comment);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
  });

  test.each(commentParams.responsePropertyList)(`When POST article comment should have %p property`, async (property) => {
    const putArticleResponse = await request(server).post(`${mock.path.article}/${article.id}/comments`).send(mock.comment);
    expect(putArticleResponse.body).toHaveProperty(property);
  });
});
