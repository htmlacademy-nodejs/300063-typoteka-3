'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`../../index`);
const {articleParams} = require(`../../../adapters`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  createdDate: `2020-01-23 03:27:49`,
  categories: [`Разное`],
};

const newArticleData = {
  title: `Как перестать беспокоиться и начать жить`,
  image: `123.png`,
  announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  fullText: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  createdDate: `2020-01-19 22:18:02`,
  categories: [`IT`],
};

describe(`Article ID API end-points`, () => {
  let article = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
  });

  test(`When GET exist article by ID status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${pathToArticles}/${article.id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.responsePropertyList)(`When GET exist article by ID should have %p property`, async (property) => {
    const res = await request(server).get(`${pathToArticles}/${article.id}`);
    expect(res.body).toHaveProperty(property);
  });

  test(`When DELETE article status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const removeArticleResponse = await request(server).delete(`${pathToArticles}/${article.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
    const removeArticleResponse = await request(server).delete(`${pathToArticles}/${article.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE not exist article response should has "empty" property`, async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
    const removeArticleResponse = await request(server).delete(`${pathToArticles}/${article.id}`);
    expect(removeArticleResponse.body).toHaveProperty(`message`);
  });

  test(`When PUT article params status code should be ${HttpCodes.OK}`, async () => {
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(newArticleData);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article without %p property status code should be ${HttpCodes.OK}`, async (property) => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each(articleParams.responsePropertyList)(`When PUT article should has %p property`, async (property) => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body).toHaveProperty(property);
  });

  test.each(articleParams.requestPropertyList)(`When PUT article should has transmitted value for %p property`, async (property) => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body[property]).toEqual(newArticleData[property]);
  });
});
