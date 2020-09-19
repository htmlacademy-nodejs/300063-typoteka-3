'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../index`);


const pathToComments = `/api/comments`;
const pathToArticles = `/api/articles`;
const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  date: `2020-09-10`,
};
const commentData = {
  text: `Новый комментарий`,
};


const commentLimit = 5;

describe(`Comments API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  describe(`GET`, () => {
    test(`When GET comment list status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server).get(pathToComments);
      expect(res.statusCode).toBe(HttpCodes.OK);
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

  describe(`DELETE`, () => {
    let commentId = null;

    beforeEach(async () => {
      const articleRes = await request(server).post(pathToArticles).send(articleData);
      const article = articleRes.body;
      const postCommentResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
      commentId = postCommentResponse.body.id;
    });

    test(`When DELETE existed comment status code should be ${HttpCodes.NO_CONTENT}`, async () => {
      const res = await request(server).delete(`${pathToComments}/${commentId}`);
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });

    test(`When DELETE not existed comment status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      await request(server).delete(`${pathToComments}/${commentId}`);
      const res = await request(server).delete(`${pathToComments}/${commentId}`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });
  });
});
