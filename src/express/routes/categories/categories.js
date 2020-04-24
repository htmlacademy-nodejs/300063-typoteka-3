'use strict';

const {Router} = require(`express`);

const categoriesRoute = new Router();

categoriesRoute.get(`/`, (req, res) => {
  const content = {
    account: {
      type: `admin`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    },
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
});

module.exports = categoriesRoute;
