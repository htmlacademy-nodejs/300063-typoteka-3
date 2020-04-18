'use strict';

const {Router} = require(`express`);

const addRoute = new Router();

addRoute.get(`/`, (req, res) => res.send(`/articles/add`));

module.exports = addRoute;
