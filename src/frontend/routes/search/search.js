'use strict';

const {Router} = require(`express`);

const {getSearchPage} = require(`./methods`);


const searchRoute = new Router();

searchRoute.get(`/`, getSearchPage);

module.exports = searchRoute;
