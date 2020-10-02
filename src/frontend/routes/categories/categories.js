'use strict';

const {Router} = require(`express`);

const {queryParamsMiddleware} = require(`../../middleware`);
const categoryIdRoute = require(`./category-id`);
const {getCategoryPage, postCategoryPage} = require(`./methods`);


const categoriesRoute = new Router();

categoriesRoute.use(`/`, categoryIdRoute);
categoriesRoute.get(`/`, queryParamsMiddleware([`updatedCategory`, `createdCategory`, `errorMessages`]), getCategoryPage);
categoriesRoute.post(`/`, postCategoryPage);

module.exports = categoriesRoute;
