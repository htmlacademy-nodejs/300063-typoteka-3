'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../../index`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  date: `2020-09-10`,
};

const newArticleData = {
  title: `Как перестать беспокоиться и начать жить`,
  image: `123.png`,
  announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  text: `Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  categories: [3, 4],
  date: `2020-09-10`,
};

describe.skip(`Article ID API end-points`, () => {
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

  test(`When PUT article with invalid title when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      title: new Array(29).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with valid title when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      title: new Array(30).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with invalid title when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      title: new Array(251).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with valid title when length is equal 250 status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      title: new Array(250).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with invalid announce when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      announce: new Array(29).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with valid announce when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      announce: new Array(30).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with invalid announce when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      announce: new Array(251).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with valid announce when length is equal 250 status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      announce: new Array(250).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with invalid text when length is great then 1000 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      text: new Array(1001).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with valid text when length is equal 1000 status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      text: new Array(1000).fill(`i`).join(``),
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with valid image extension status code should be ${HttpCodes.OK}`, async () => {
    const articleParams = {
      image: `123.png`,
    };
    const resWithPng = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(resWithPng.statusCode).toBe(HttpCodes.OK);
    articleParams.image = `123.jpg`;
    const resWithJpg = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(resWithJpg.statusCode).toBe(HttpCodes.OK);
  });

  test(`When PUT article with invalid image extension status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      image: `123.pmng`,
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with invalid date format status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      date: `10-09-2020`,
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with categories length equal 0 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      categories: [],
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article with not exist property status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const articleParams = {
      test: `test`,
    };
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(articleParams);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When GET article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request(server).get(`${pathToArticles}/not-number`).send(newArticleData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When GET article when articleId is number status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).get(`${pathToArticles}/${article.id}`).send(newArticleData);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });

  test(`When DELETE article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const removeArticleResponse = await request(server).delete(`${pathToArticles}/not-number`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE article when articleId is number status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const removeArticleResponse = await request(server).delete(`${pathToArticles}/${article.id}`);
    expect(removeArticleResponse.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When PUT article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request(server).put(`${pathToArticles}/not-number`).send(newArticleData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When PUT article when articleId is number status code should be ${HttpCodes.OK}`, async () => {
    const res = await request(server).put(`${pathToArticles}/${article.id}`).send(newArticleData);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });
});
