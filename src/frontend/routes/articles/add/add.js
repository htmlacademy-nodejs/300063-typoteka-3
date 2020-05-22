'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);
const {accountAdapter} = require(`frontend/adapters`);


const addRoute = new Router();

addRoute.get(`/`, (req, res) => {
  const content = {
    type: `add`,
    article: {
      image: null,
      date: null,
      title: ``,
      subTitle: ``,
      text: [],
      categoryList: [],
    },
    account: accountAdapter.getAuth(),
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
});

module.exports = addRoute;
