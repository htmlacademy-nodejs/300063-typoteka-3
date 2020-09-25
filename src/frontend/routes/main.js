'use strict';

const {Router} = require(`express`);

const {
  accountByIdMiddleware,
  checkAdminMiddleware,
  internalServerErrorMiddleware,
  localsMiddleware,
  notFoundMiddleware,
  tokenDetailsMiddleware,
  unauthorizedMiddleware
} = require(`../middleware`);
const notFoundRoute = require(`./404`);
const articlesRoute = require(`./articles`);
const categoriesRoute = require(`./categories`);
const loginRoute = require(`./login`);
const logoutRoute = require(`./logout`);
const myRoute = require(`./my`);
const registerRoute = require(`./register`);
const searchRoute = require(`./search`);
const {getMainPage} = require(`./methods`);


const mainRoute = new Router();

mainRoute.use(localsMiddleware);
mainRoute.use(tokenDetailsMiddleware);
mainRoute.use(accountByIdMiddleware);
mainRoute.use(`/articles`, articlesRoute);
mainRoute.use(`/categories`, checkAdminMiddleware, categoriesRoute);
mainRoute.use(`/login`, unauthorizedMiddleware, loginRoute);
mainRoute.use(`/logout`, logoutRoute);
mainRoute.use(`/my`, checkAdminMiddleware, myRoute);
mainRoute.use(`/register`, unauthorizedMiddleware, registerRoute);
mainRoute.use(`/search`, searchRoute);
mainRoute.use(`/not-found`, notFoundRoute);
mainRoute.get(`/`, getMainPage);
mainRoute.use(notFoundMiddleware);
mainRoute.use(internalServerErrorMiddleware);

module.exports = mainRoute;
