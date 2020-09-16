'use strict';

const {Router} = require(`express`);

const {getCategoryPage, postCategoryPage} = require(`./methods`);
const categoryIdRoute = require(`./category-id`);


const categoriesRoute = new Router();

categoriesRoute.use(`/`, categoryIdRoute);
categoriesRoute.get(`/`, getCategoryPage);
categoriesRoute.post(`/`, postCategoryPage);

module.exports = categoriesRoute;
