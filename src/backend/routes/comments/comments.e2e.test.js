'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {getRandomString} = require(`../../utils`);
const {apiContainer} = require(`../../api`);


const pathToComments = `/api/comments`;
const pathToArticles = `/api/articles`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

const articleData = {
  title: getRandomString(AVAILABLE_SYMBOLS, 40),
  image: `123.png`,
  announce: getRandomString(AVAILABLE_SYMBOLS, 40),
  text: getRandomString(AVAILABLE_SYMBOLS, 40),
  categories: [1, 2, 3],
  date: `2020-09-10`,
};
const commentData = {
  accountId: 1,
  text: getRandomString(AVAILABLE_SYMBOLS, 10),
};

const commentLimit = 5;

describe(`Comments API end-points`, () => {
  let server = null;
  let article = null;

  beforeAll(async () => {
    server = await apiContainer.getInstance();
  });

  beforeEach(async () => {
    const postArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = postArticleResponse.body;
  });

  afterAll(async () => {
    await apiContainer.close();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET comment list status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(pathToComments);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET comment list by article id with not exist article status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      await request(server).delete(`${pathToArticles}/${article.id}`);
      const res = await request(server).get(`${pathToComments}?articleId=${article.id}`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When GET comment list with limit status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(`${pathToComments}?limit=${commentLimit}`);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When GET comment list with limit should return correct count of comments`, async () => {
      const res = await request(server).get(`${pathToComments}?limit=${commentLimit}`);
      expect(res.body.length).toBe(commentLimit);
    });
  });

  describe(`POST`, () => {
    test(`When POST article comment status code should be ${HttpCodes.CREATED}`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      const res = await request(server).post(pathToComments).send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST article comment without "text" property should have ${HttpCodes.BAD_REQUEST}`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      delete comment.text;
      const postCommentResponse = await request(server).post(pathToComments).send(comment);
      expect(postCommentResponse.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test.each([`id`, `text`, `date`, `accountId`, `articleId`])(`When POST article comment should have %p property`, async (property) => {
      const comment = {
        ...commentData,
        articleId: article.id,
      };
      const postCommentResponse = await request(server).post(pathToComments).send(comment);
      expect(postCommentResponse.body).toHaveProperty(property);
    });

    test(`When POST article with invalid text when length is great then 1000 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,

        text: getRandomString(AVAILABLE_SYMBOLS, 1001),
      };
      const res = await request(server).post(pathToComments).send(comment);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST article with valid text when length is equal 1000 status code should be ${HttpCodes.CREATED}`, async () => {
      const comment = {
        ...commentData,
        articleId: article.id,
        text: getRandomString(AVAILABLE_SYMBOLS, 1000),
      };
      const res = await request(server).post(pathToComments).send(comment);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });
  });
});
