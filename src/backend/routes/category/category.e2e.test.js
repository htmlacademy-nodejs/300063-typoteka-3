'use strict';

const bcrypt = require(`bcrypt`);
const request = require(`supertest`);
const HttpCodes = require(`http-status-codes`);

const {apiContainer} = require(`../../api`);
const {db, initDb} = require(`../../db`);
const {getRandomString} = require(`../../utils`);


const pathToCategories = `/api/categories`;
const pathToLogin = `/api/user/login`;
const AVAILABLE_SYMBOLS = `abcdefghijklmnopqrstuvwxyz`;
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


describe(`Categories API end-points`, () => {
  let server = null;
  let adminCookie = null;
  let userCookie = null;

  beforeAll(async () => {
    await initTest();
    server = await apiContainer.getInstance();
    const admin = await request(server).post(pathToLogin).send(authAdminParams);
    adminCookie = admin.headers[`set-cookie`];
    const user = await request(server).post(pathToLogin).send(authUserParams);
    userCookie = user.headers[`set-cookie`];
  });

  afterAll(async () => {
    await apiContainer.destroyInstance();
    server = null;
  });

  describe(`PUT`, () => {
    let category = null;
    const categoryParams = {
      title: getRandomString(AVAILABLE_SYMBOLS, 10),
    };

    beforeAll(async () => {
      const categoryRes = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(categoryParams);
      category = categoryRes.body;
    });

    test(`When PUT category with invalid categoryId status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 10),
      };
      const res = await request(server)
        .put(`${pathToCategories}/invalid-category-id`)
        .set(`cookie`, adminCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with invalid title when length is less then 5 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 4),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .set(`cookie`, adminCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 5 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 5),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .set(`cookie`, adminCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT category with invalid title when length is great then 30 status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 31),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .set(`cookie`, adminCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When PUT category with valid title when length is equal 30 status code should be ${HttpCodes.OK}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .set(`cookie`, adminCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.OK);
    });

    test(`When PUT category without admin access token status code should be ${HttpCodes.UNAUTHORIZED}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When PUT category with not admin access token status code should be ${HttpCodes.FORBIDDEN}`, async () => {
      const updatedCategoryParams = {
        title: getRandomString(AVAILABLE_SYMBOLS, 30),
      };
      const res = await request(server)
        .put(`${pathToCategories}/${category.id}`)
        .set(`cookie`, userCookie)
        .send(updatedCategoryParams);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });


  describe(`DELETE`, () => {
    let category = null;
    const categoryParams = {
      title: getRandomString(AVAILABLE_SYMBOLS, 10),
    };

    beforeAll(async () => {
      const categoryRes = await request(server)
        .post(pathToCategories)
        .set(`cookie`, adminCookie)
        .send(categoryParams);
      category = categoryRes.body;
    });

    test(`When DELETE category with invalid categoryId status code should be ${HttpCodes.BAD_REQUEST}`, async () => {
      const res = await request(server)
        .delete(`${pathToCategories}/invalid-category-id`)
        .set(`cookie`, adminCookie);
      expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    });

    test(`When DELETE category with valid categoryId status code should be ${HttpCodes.NO_CONTENT}`, async () => {
      const res = await request(server)
        .delete(`${pathToCategories}/${category.id}`)
        .set(`cookie`, adminCookie);
      expect(res.statusCode).toBe(HttpCodes.NO_CONTENT);
    });

    test(`When DELETE category without access token status code should be ${HttpCodes.UNAUTHORIZED}`, async () => {
      const res = await request(server).delete(`${pathToCategories}/${category.id}`);
      expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
    });

    test(`When DELETE category with not admin access token status code should be ${HttpCodes.FORBIDDEN}`, async () => {
      const res = await request(server)
        .delete(`${pathToCategories}/${category.id}`)
        .set(`cookie`, userCookie);
      expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
    });
  });
});
