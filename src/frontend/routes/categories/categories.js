'use strict';

const {Router} = require(`express`);

const {getCategoryPage} = require(`./methods`);


const categoriesRoute = new Router();

categoriesRoute.get(`/`, getCategoryPage);

module.exports = categoriesRoute;
