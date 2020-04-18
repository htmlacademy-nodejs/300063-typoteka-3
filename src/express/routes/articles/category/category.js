'use strict';

const {Router} = require(`express`);

const categoryRoute = new Router();

categoryRoute.get(`/:id`, (req, res) => res.send(`/articles/category/:id`));

module.exports = categoryRoute;
