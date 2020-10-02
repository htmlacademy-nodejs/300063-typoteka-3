'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const pathToArticles = `/api/articles`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

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
const authAdminParams = {
  email: `admin@mail.ru`,
  password: `123456`,
};
const authUserParams = {
  email: `user@mail.ru`,
  password: `654321`,
};

const initTest = async () => {
  await initDb(true);
  await createUsers();
  const categoriesForDbTable = new Array(5)
    .fill(``)
    .map(() => ({title: getRandomString(AVAILABLE_SYMBOLS, 10)}));
  await db.Category.bulkCreate(categoriesForDbTable);
};

const createUsers = async () => {
  return await db.Account.bulkCreate([
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authAdminParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authAdminParams.password, 10),
      isAdmin: true,
    },
    {
      firstname: getRandomString(AVAILABLE_SYMBOLS, 20),
      lastname: getRandomString(AVAILABLE_SYMBOLS, 20),
      email: authUserParams.email,
      avatar: `test.png`,
      password: bcrypt.hashSync(authUserParams.password, 10),
      isAdmin: false,
    },
  ]);
};

describe(`Article ID API end-points`, () => {
  let server = null;
  let article = null;
  let cookie = null;

  beforeAll(async () => {
    await initTest();
    server = await apiContainer.getInstance();
    const admin = await request(server).post(pathToLogin).send(authAdminParams);
    cookie = admin.headers[`set-cookie`];
  });

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET exist article by ID status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(`${pathToArticles}/${article.id}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test.each([`id`, `title`, `image`, `announce`, `text`, `date`, `categories`])(`When GET exist article by ID should have %p property`, async (property) => {
      const res = await request(server).get(`${pathToArticles}/${article.id}`);
      expect(res.body).toHaveProperty(property);
    });

    test(`When GET article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server).get(`${pathToArticles}/not-number`).send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When GET article when articleId is number status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(`${pathToArticles}/${article.id}`).send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });

  describe(`DELETE`, () => {
    test(`When DELETE article status code should be ${HttpCodes.NO_CONTENT}`, async () => {
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });

    test(`When DELETE not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE not exist article response should has "empty" property`, async () => {
      await request(server).delete(`${pathToArticles}/${article.id}`);
      await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      expect(res.body).toHaveProperty(`message`);
    });

    test(`When DELETE article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .delete(`${pathToArticles}/not-number`)
        .set(`cookie`, cookie)
        .send();
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE article when articleId is number status code should be ${HttpCodes.NO_CONTENT}`, async () => {
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send();
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });

    test(`When DELETE article without access token status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .send();
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE article with not admin access token status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const user = await request(server).post(pathToLogin).send(authUserParams);
      const res = await request(server)
        .delete(`${pathToArticles}/${article.id}`)
        .set(`cookie`, user.headers[`set-cookie`])
        .send();
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });
  });

  describe(`PUT`, () => {
    test(`When PUT article params status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid title when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 29),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with valid title when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid title when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 251),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with valid title when length is equal 250 status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 250),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid announce when length is less then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        announce: getRandomString(AVAILABLE_SYMBOLS, 29),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with valid announce when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        announce: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid announce when length is great then 250 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        announce: getRandomString(AVAILABLE_SYMBOLS, 251),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with valid announce when length is equal 250 status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        announce: getRandomString(AVAILABLE_SYMBOLS, 250),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid text when length is great then 1000 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        text: getRandomString(AVAILABLE_SYMBOLS, 1001),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with valid text when length is equal 1000 status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        text: getRandomString(AVAILABLE_SYMBOLS, 1000),
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with valid image extension status code should be ${HttpCodes.OK}`, async () => {
      const articleParams = {
        image: `123.png`,
      };
      const resWithPng = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(resWithPng.statusCode).toBe(HttpCodes.OK);
      articleParams.image = `123.jpg`;
      const resWithJpg = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(resWithJpg.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article with invalid image extension status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        image: `123.pmng`,
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with invalid date format status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        date: `10-09-2020`,
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with categories length equal 0 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        categories: [],
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article with not exist property status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const articleParams = {
        test: `test`,
      };
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(articleParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article when articleId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .put(`${pathToArticles}/not-number`)
        .set(`cookie`, cookie)
        .send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT article when articleId is number status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, cookie)
        .send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT article without access token status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE article with not admin access token status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const user = await request(server).post(pathToLogin).send(authUserParams);
      const res = await request(server)
        .put(`${pathToArticles}/${article.id}`)
        .set(`cookie`, user.headers[`set-cookie`])
        .send(newArticleData);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });
  });
});
