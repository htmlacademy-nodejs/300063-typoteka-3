'use strict';

const {Router} = require(`express`);

const {getCategories, postCategory, putCategory, deleteCategory} = require(`./methods`);
const {schemaValidator, paramsValidator} = require(`../../middleware`);
const {getRouteParamsValidationSchema} = require(`../../utils`);
const {newCategorySchema} = require(`../../schemas`);


const routeParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`categoryId`]));

const apiCategories = new Router();
apiCategories.get(`/`, getCategories);
apiCategories.post(`/`, schemaValidator(newCategorySchema), postCategory);
apiCategories.put(
    `/:categoryId`,
    [
      routeParamsValidationMiddleware,
      schemaValidator(newCategorySchema)
    ],
    putCategory
);
apiCategories.delete(`/:categoryId`, routeParamsValidationMiddleware, deleteCategory);

module.exports = apiCategories;
