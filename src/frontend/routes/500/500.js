'use strict';

const {Router} = require(`express`);

const {getNotFoundPage} = require(`./methods`);

const internalServerErrorRoute = new Router();

internalServerErrorRoute.get(`/`, getNotFoundPage);

module.exports = internalServerErrorRoute;
