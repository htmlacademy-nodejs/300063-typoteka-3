'use strict';

const {Router} = require(`express`);
const articlesRoute = require(`./articles`);
const categoriesRoute = require(`./categories`);
const loginRoute = require(`./login`);
const myRoute = require(`./my`);
const registerRoute = require(`./register`);
const searchRoute = require(`./search`);

const mainRoute = new Router();

mainRoute.use(`/articles`, articlesRoute);
mainRoute.use(`/categories`, categoriesRoute);
mainRoute.use(`/login`, loginRoute);
mainRoute.use(`/my`, myRoute);
mainRoute.use(`/register`, registerRoute);
mainRoute.use(`/search`, searchRoute);
mainRoute.get(`/`, (req, res) => res.send(`/`));

module.exports = mainRoute;
