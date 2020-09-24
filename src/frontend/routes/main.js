'use strict';

const {Router} = require(`express`);

const {accountByTokenMiddleware, checkAdminMiddleware, localsMiddleware, unauthorizedMiddleware} = require(`../middleware`);
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
mainRoute.use(accountByTokenMiddleware);
mainRoute.use(`/articles`, articlesRoute);
mainRoute.use(`/categories`, checkAdminMiddleware, categoriesRoute);
mainRoute.use(`/login`, unauthorizedMiddleware, loginRoute);
mainRoute.use(`/logout`, logoutRoute);
mainRoute.use(`/my`, checkAdminMiddleware, myRoute);
mainRoute.use(`/register`, unauthorizedMiddleware, registerRoute);
mainRoute.use(`/search`, searchRoute);
mainRoute.get(`/`, getMainPage);

module.exports = mainRoute;
