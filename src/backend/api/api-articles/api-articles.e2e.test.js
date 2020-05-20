'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const {articleParams} = require(`backend/adapters`);
const mock = require(`backend/test-mock/data`);


describe(`Articles API end-points`, () => {
  test(`When GET article list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(mock.path.article);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST article status code should be ${HttpCodes.CREATED}`, async() => {
    const res = await request(server).post(mock.path.article).send(mock.article.data);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
    await request(server).delete(`${mock.path.article}/${res.body.id}`);
  });

  test.each(articleParams.requestPropertyList)(`When POST article should have %p property`, async(property) => {
    const res = await request(server).post(mock.path.article).send(mock.article.data);
    expect(res.body).toHaveProperty(property);
    await request(server).delete(`${mock.path.article}/${res.body.id}`);
  });

  test.each(articleParams.requestPropertyList)(`When POST article without %p property status code should be ${HttpCodes.BAD_REQUEST}`, async (property) => {
    const article = {...mock.article.data};
    delete article[property];
    const res = await request(server).post(mock.path.article).send(article);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });
});
