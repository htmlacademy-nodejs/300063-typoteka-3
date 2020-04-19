'use strict';

const {Router} = require(`express`);

const loginRoute = new Router();

loginRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    error: {
      email: false,
      password: false,
    },
    script: {
      vendor: false,
      main: false,
    },
  };

  res.render(`pages/login`, content);
});

module.exports = loginRoute;
