'use strict';

const {Router} = require(`express`);

const {postCategoryId} = require(`./methods`);


const categoryIdRoute = new Router();

categoryIdRoute.post(`/:categoryId`, postCategoryId);

module.exports = categoryIdRoute;
