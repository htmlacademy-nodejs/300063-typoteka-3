'use strict';

const {Router} = require(`express`);

const {logger} = require(`../../utils`);
const {accountAdapter} = require(`../../adapters`);


const categoriesRoute = new Router();

categoriesRoute.get(`/`, (req, res) => {
  const content = {
    account: accountAdapter.getAuth(),
    categoryList: [
      {
        id: `category-1`,
        name: `Автомобили`,
      },
      {
        id: `category-2`,
        name: `Бизнес`,
      },
      {
        id: `category-3`,
        name: `Дизайн`,
      },
    ],
  };
  res.render(`pages/categories`, content);
  logger.endRequest(req, res);
});

module.exports = categoriesRoute;
