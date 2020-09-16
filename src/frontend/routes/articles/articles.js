'use strict';

const {Router} = require(`express`);

const addRoute = require(`./add`);
const categoryRoute = require(`./category`);
const editRoute = require(`./edit`);
const {getArticlePage, postArticlePage} = require(`./methods`);
const {queryParamsMiddleware} = require(`../../middleware`);


const articlesRoute = new Router();

articlesRoute.use(`/add`, addRoute);
articlesRoute.use(`/category`, categoryRoute);
articlesRoute.use(`/edit`, editRoute);
articlesRoute.get(`/:articleId`, queryParamsMiddleware([`errorMessages`, `comment`]), getArticlePage);
articlesRoute.post(`/:articleId`, postArticlePage);

module.exports = articlesRoute;
