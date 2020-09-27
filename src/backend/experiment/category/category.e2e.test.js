'use strict';

const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const {getRandomString} = require(`../../utils`);
const {api} = require(`../index`);


const pathToCategories = `/api/categories`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;

describe(`Categories API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await api.getInstance();
  });

  afterAll(async () => {
    await api.close();
    server = null;
  });

  describe(`PUT`, () => {
    let category = null;
    const categoryParams = {
      title: getRandomString(AVAILABLE_SYMBOLS, 10),
    };

    beforeAll(async () => {
      const categoryRes = await request(server).post(pathToCategories).send(categoryParams);
      category = categoryRes.body;
    });

    test(`When PUT category with invalid categoryId status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 10),
      };
      const res = await request(server).put(`${pathToCategories}/invalid-category-id`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with invalid title when length is less then 5 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 4),
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 5 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 5),
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 31),
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });


  describe(`DELETE`, () => {
    let category = null;
    const categoryParams = {
      title: getRandomString(AVAILABLE_SYMBOLS, 10),
    };

    beforeAll(async () => {
      const categoryRes = await request(server).post(pathToCategories).send(categoryParams);
      category = categoryRes.body;
    });

    test(`When DELETE category with invalid categoryId status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server).delete(`${pathToCategories}/invalid-category-id`);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE category with valid categoryId status code should be ${HttpCodes.NO_CONTENT}`, async () => {
      const res = await request(server).delete(`${pathToCategories}/${category.id}`);
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });
  });
});
