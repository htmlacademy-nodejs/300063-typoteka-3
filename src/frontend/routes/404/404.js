'use strict';

const {Router} = require(`express`);

const {getNotFoundPage} = require(`./methods`);

const notFoundRoute = new Router();

notFoundRoute.get(`/`, getNotFoundPage);

module.exports = notFoundRoute;
