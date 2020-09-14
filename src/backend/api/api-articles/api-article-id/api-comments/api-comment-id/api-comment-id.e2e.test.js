'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const apiServer = require(`../../../../index`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона test`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  text: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  categories: [1, 2, 3],
  createdAt: `2020-09-10`,
};

const commentData = {
  text: `Новый комментарий`,
};

describe(`Article comments API end-points`, () => {
  let article = null;
  let comment = null;
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
    const createCommentResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
    comment = createCommentResponse.body;
  });

  afterAll(async () => {
    await apiServer.close();
    server = null;
  });

  test(`When DELETE article comment by ID status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const res = await request(server).delete(`${pathToArticles}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
  });

  test(`When DELETE comment if article with ID isn't exist status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
    const res = await request(server).delete(`${pathToArticles}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE not exist comment status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    await request(server).delete(`${pathToArticles}/${article.id}/comments/${comment.id}`);
    const res = await request(server).delete(`${pathToArticles}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE comment when commentId is not number status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request(server).delete(`${pathToArticles}/${article.id}/comments/not-number`);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
  });

  test(`When DELETE comment when commentId is number status code should be ${HttpCodes.NO_CONTENT}`, async () => {
    const res = await request(server).delete(`${pathToArticles}/${article.id}/comments/${comment.id}`);
    expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
  });
});
