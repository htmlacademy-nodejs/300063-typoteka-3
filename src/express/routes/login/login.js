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
    hasScripts: true,
  };

  res.render(`pages/login`, content);
});

module.exports = loginRoute;
