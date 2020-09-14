'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../../index`);


const pathToArticles = `/api/articles`;
const pathToCategories = `/api/categories`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  createdAt: `2020-09-10`,
};

const newArticleData = {
  title: `Как перестать беспокоиться и начать жить`,
  image: `123.png`,
  announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  text: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  categories: [3, 4],
  createdAt: `2020-09-10`,
};

describe(`Article ID API end-points`, () => {
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

  test(`When GET exist article by ID status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${pathToArticles}/${article.id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test.each([`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When GET exist article by ID should have %p property`, async (property) => {
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

  test.each([`title`, `image`, `announce`, `text`, `categories`])(`When PUT article without %p property status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.statusCode).toBe(HttpCodes.OK);
  });

  test.each( [`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When PUT article should has %p property`, async (property) => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body).toHaveProperty(property);
  });

  test.each([`title`, `image`, `announce`, `text`])(`When PUT article should has transmitted value for %p property`, async (property) => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(putArticleResponse.body[property]).toEqual(newArticleData[property]);
  });

  test(`When PUT article should has transmitted value for "categories" property`, async () => {
    const articleParams = {...newArticleData};
    const putArticleResponse = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    const categoriesRes = await request(server).get(pathToCategories).send();
    const categories = categoriesRes.body
      .filter((category) => putArticleResponse.body.categories.includes(category.title))
      .map((category) => category.title);
    expect(putArticleResponse.body.categories).toEqual(categories);
  })
});
