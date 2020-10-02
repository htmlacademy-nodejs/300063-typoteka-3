'use strict';

const {Router} = require(`express`);

const addRoute = require(`./add`);
const categoryRoute = require(`./category`);
const editRoute = require(`./edit`);
const {getArticlePage, postArticlePage} = require(`./methods`);
const {checkAdminMiddleware, queryParamsMiddleware} = require(`../../middleware`);


const articlesRoute = new Router();

articlesRoute.use(`/add`, checkAdminMiddleware, addRoute);
articlesRoute.use(`/category`, categoryRoute);
articlesRoute.use(`/edit`, checkAdminMiddleware, editRoute);
articlesRoute.get(`/:articleId`, queryParamsMiddleware([`errorMessages`, `comment`]), getArticlePage);
articlesRoute.post(`/:articleId`, postArticlePage);

module.exports = articlesRoute;
