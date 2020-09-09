'use strict';

const {Router} = require(`express`);

const addRoute = require(`./add`);
const categoryRoute = require(`./category`);
const editRoute = require(`./edit`);
const {getArticlePage} = require(`./methods`);


const articlesRoute = new Router();

articlesRoute.use(`/add`, addRoute);
articlesRoute.use(`/category`, categoryRoute);
articlesRoute.use(`/edit`, editRoute);
articlesRoute.get(`/:articleId`, getArticlePage);

module.exports = articlesRoute;
