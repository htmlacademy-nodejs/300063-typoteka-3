'use strict';

const {Router} = require(`express`);

const {schemaValidator, paramsValidator} = require(`../../../middleware`);
const {getRouteParamsValidationSchema} = require(`../../../utils`);
const {updatedArticleSchema} = require(`../../../schemas`);
const apiComments = require(`./api-comments`);
const {getArticleId, putArticleId, deleteArticleId} = require(`./methods`);


const routeParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`articleId`]));

const apiArticleId = new Router({mergeParams: true});
apiArticleId.use(`/comments`, apiComments);
apiArticleId.get(`/`, routeParamsValidationMiddleware, getArticleId);
apiArticleId.put(
    `/`,
    [
      routeParamsValidationMiddleware,
      schemaValidator(updatedArticleSchema)
    ],
    putArticleId
);
apiArticleId.delete(`/`, routeParamsValidationMiddleware, deleteArticleId);

module.exports = apiArticleId;
