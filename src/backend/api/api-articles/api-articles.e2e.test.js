'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`backend/api`);
const {articleParams} = require(`backend/adapters`);


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
    newDate: {
      title: `Как перестать беспокоиться и начать жить`,
      announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
      fullText: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
      createdDate: `2020-01-19 22:18:02`,
      category: [`IT`],
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

  test(`When GET exist article by ID status code should be ${HttpCodes.OK}`, async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const res = await request(server).get(`${mock.path.article}/${createArticleResponse.body.id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.responsePropertyList)(`When GET exist article by ID should have %p property`, async (property) => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const res = await request(server).get(`${mock.path.article}/${createArticleResponse.body.id}`);
    expect(res.body).toHaveProperty(property);
  });

  test(`When DELETE article status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${createArticleResponse.body.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    await request(server).delete(`${mock.path.article}/${createArticleResponse.body.id}`);
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${createArticleResponse.body.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE not exist article response should has "empty" property`, async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    await request(server).delete(`${mock.path.article}/${createArticleResponse.body.id}`);
    const removeArticleResponse = await request(server).delete(`${mock.path.article}/${createArticleResponse.body.id}`);
    expect(removeArticleResponse.body).toHaveProperty(`message`);
  });

  test(`When PUT article params status code should be ${HttpCodes.OK}`, async () => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const putArticleResponse = await request(server).put(`${mock.path.article}/${createArticleResponse.body.id}`).send(mock.article.newDate);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article without %p property status code should be ${HttpCodes.OK}`, async (property) => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const article = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${createArticleResponse.body.id}`).send(article);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
    await request(server).delete(`${mock.path.article}/${putArticleResponse}`);
  });

  test.each(articleParams.responsePropertyList)(`When PUT article should has %p property`, async (property) => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const article = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${createArticleResponse.body.id}`).send(article);
    expect(putArticleResponse.body).toHaveProperty(property);
    await request(server).delete(`${mock.path.article}/${putArticleResponse}`);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article should has transmitted value for %p property`, async (property) => {
    const createArticleResponse = await request(server).post(mock.path.article).send(mock.article.data);
    const article = {...mock.article.newDate};
    const putArticleResponse = await request(server).put(`${mock.path.article}/${createArticleResponse.body.id}`).send(article);
    expect(putArticleResponse.body[property]).toEqual(mock.article.newDate[property]);
    await request(server).delete(`${mock.path.article}/${putArticleResponse}`);
  });
});
