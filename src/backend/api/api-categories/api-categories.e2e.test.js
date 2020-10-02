'use strict';

const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const apiServer = require(`../index`);


const pathToCategories = `/api/categories`;

describe(`Categories API end-points`, () => {
  let server = null;

  beforeAll(async () => {
    server = await apiServer.getInstance();
  });

  afterAll(async () => {
    await apiServer.close();
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
        title: new Array(4).fill(`i`).join(``)
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 5 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: new Array(5).fill(`i`).join(``)
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });

    test(`When POST category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const category = {
        title: new Array(31).fill(`i`).join(``)
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When POST category with valid title when length is equal 30 status code should be ${HttpCodes.CREATED}`, async () => {
      const category = {
        title: new Array(30).fill(`i`).join(``)
      };
      const res = await request(server).post(pathToCategories).send(category);
      expect(res.statusCode).toBe(HttpCodes.CREATED);
    });
  });


  describe(`PUT`, () => {
    let category = null;
    const categoryParams = {
      title: new Array(10).fill(`i`).join(``)
    };

    beforeAll(async () => {
      const categoryRes = await request(server).post(pathToCategories).send(categoryParams);
      category = categoryRes.body;
    });

    test(`When PUT category with invalid categoryId status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: new Array(10).fill(`i`).join(``)
      };
      const res = await request(server).put(`${pathToCategories}/invalid-category-id`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with invalid title when length is less then 5 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: new Array(4).fill(`i`).join(``)
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 5 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: new Array(5).fill(`i`).join(``)
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: new Array(31).fill(`i`).join(``)
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: new Array(30).fill(`i`).join(``)
      };
      const res = await request(server).put(`${pathToCategories}/${category.id}`).send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });
  });


  describe(`DELETE`, () => {
    let category = null;
    const categoryParams = {
      title: new Array(10).fill(`i`).join(``)
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
