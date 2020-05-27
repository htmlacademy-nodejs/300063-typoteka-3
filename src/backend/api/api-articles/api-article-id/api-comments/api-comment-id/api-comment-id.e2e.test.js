'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const mock = require(`backend/test-mock/data`);

describe(`Article comments API end-points`, () => {
  let article = null;
  let comment = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    article = createArticleResponse.body;
    const createCommentResponse = await request(server).post(`${mock.path.article}/${article.id}/comments`).send(mock.comment);
    comment = createCommentResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
  });

  test(`When DELETE article comment by ID status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const res = await request(server).delete(`${mock.path.article}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE comment if article with ID isn't exist status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${mock.path.article}/${article.id}`);
    const res = await request(server).delete(`${mock.path.article}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE not exist comment status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${mock.path.article}/${article.id}/comments/${comment.id}`);
    const res = await request(server).delete(`${mock.path.article}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });
});
