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

  describe(`GET`, () => {
    test(`When GET categories status code should be ${HttpCodes.OK}`, async () => {
      const res = await request(server)
        .get(pathToCategories);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });

  describe(`POST`, () => {
    test(`When POST valid categories status code should be ${HttpCodes.CREATED}`, async () => {
      const res = await request(server).post(pathToCategories).send({title: `test test`});
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST empty object status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server).post(pathToCategories).send({});
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with invalid title when length is less then 5 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 4),
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 5 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 5),
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 31),
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 30 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });
  });
});
