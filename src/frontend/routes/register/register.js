'use strict';

const {Router} = require(`express`);
const {logger} = require(`../../utils`);


const registerRoute = new Router();

registerRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    error: {
      email: false,
      password: false,
    },
  };
  res.render(`pages/register`, content);
  logger.endRequest(req, res);
});

module.exports = registerRoute;
