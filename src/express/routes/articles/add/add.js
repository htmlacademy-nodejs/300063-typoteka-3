'use strict';

const {Router} = require(`express`);

const addRoute = new Router();

addRoute.get(`/`, (req, res) => {
  const content = {
    article: {
      image: null,
      date: null,
      title: ``,
      subTitle: ``,
      text: [],
      categoryList: [],
    },
    account: {
      type: `admin`
    },
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
});

module.exports = addRoute;
