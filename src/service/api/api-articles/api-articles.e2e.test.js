'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`service/api`);
const {articleParams} = require(`service/adapters`);


const mock = {
  path: {
    article: `/api/articles`,
  },
  article: {
    data: {
      title: `Обзор новейшего смартфона`,
      announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
      fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
      createdDate: `2020-01-23 03:27:49`,
      category: [`Разное`],
    },
  },
};


describe(`Articles API end-points`, () => {
  test(`When GET article list status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(mock.path.article);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When POST article status code should be ${HttpCodes.CREATED}`, async() => {
    const res = await request(server).post(mock.path.article).send(mock.article.data);
    expect(res.statusCode).toBe(HttpCodes.CREATED);
  });

  test.each(articleParams.requestPropertyList)(`When POST article should has %p property`, async(property) => {
    const res = await request(server).post(mock.path.article).send(mock.article.data);
    expect(res.body).toHaveProperty(property);
  });

  test.each(articleParams.requestPropertyList)(`When POST article without %p property should be ${HttpCodes.BAD_REQUEST}`, async (property) => {
    const article = {...mock.article.data};
    delete article[property];
    const res = await request(server).post(mock.path.article).send(article);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  })
});
