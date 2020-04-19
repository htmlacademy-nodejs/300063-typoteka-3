'use strict';

const {Router} = require(`express`);

const registerRoute = new Router();

registerRoute.get(`/`, (req, res) => {
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
  res.render(`pages/register`, content);
});

module.exports = registerRoute;
