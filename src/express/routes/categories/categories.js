'use strict';

const {Router} = require(`express`);

const categoriesRoute = new Router();

categoriesRoute.get(`/`, (req, res) => res.send(`/categories`));

module.exports = categoriesRoute;
