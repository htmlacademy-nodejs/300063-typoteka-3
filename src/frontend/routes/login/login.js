'use strict';

const {Router} = require(`express`);

const {logger} = require(`../../utils`);


const loginRoute = new Router();

loginRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    error: {
      email: false,
      password: false,
    },
  };

  res.render(`pages/login`, content);
  logger.endRequest(req, res);
});

module.exports = loginRoute;
