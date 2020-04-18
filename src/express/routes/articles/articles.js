'use strict';

const {Router} = require(`express`);

const addRoute = require(`./add`);
const categoryRoute = require(`./category`);
const editRoute = require(`./edit`);

const articlesRoute = new Router();

articlesRoute.use(`/add`, addRoute);
articlesRoute.use(`/category`, categoryRoute);
articlesRoute.use(`/edit`, editRoute);
articlesRoute.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = articlesRoute;
