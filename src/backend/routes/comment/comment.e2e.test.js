'use strict';

const HttpCodes = require(`http-status-codes`);
const request = require(`supertest`);

const {apiContainer} = require(`../../api`);


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
  accountId: 1,
  text: `Новый комментарий`,
};

describe(`Comments API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiContainer.getInstance();
  });

  afterAll(async () => {
    await apiContainer.close();
    server = null;
  });

  describe.only(`DELETE`, () => {
    let commentId = null;

    beforeEach(async () => {
      const postArticleResponse = await request(server).post(pathToArticles).send(articleData);
      const article = postArticleResponse.body;
      const postCommentResponse = await request(server).post(pathToComments).send({
        ...commentData,
        articleId: article.id,
      });
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

    test(`When DELETE invalid comment id status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server).delete(`${pathToComments}/invalid-id`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });
  });
});
