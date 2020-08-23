'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const server = require(`../../../../index`);


const pathToArticles = `/api/articles`;

const articleData = {
  title: `Обзор новейшего смартфона`,
  image: `123.png`,
  announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  createdDate: `2020-01-23 03:27:49`,
  categories: [`Разное`],
};

const commentData = {
  text: `Новый комментарий`,
};

describe(`Article comments API end-points`, () => {
  let article = null;
  let comment = null;

  beforeEach(async () => {
    const createArticleResponse = await request(server).post(pathToArticles).send(articleData);
    article = createArticleResponse.body;
    const createCommentResponse = await request(server).post(`${pathToArticles}/${article.id}/comments`).send(commentData);
    comment = createCommentResponse.body;
  });

  afterEach(async () => {
    await request(server).delete(`${pathToArticles}/${article.id}`);
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
});
