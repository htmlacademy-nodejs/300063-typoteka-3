'use strict';

const {Router} = require(`express`);

const {getRouteParamsValidationSchema} = require(`../../../../../utils`);
const {paramsValidator} = require(`../../../../../middleware`);
const {deleteCommentId} = require(`./methods`);


const routeParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema(
    [`articleId`, `commentId`]
));

const apiCommentId = new Router({mergeParams: true});

apiCommentId.delete(`/`, routeParamsValidationMiddleware, deleteCommentId);

module.exports = apiCommentId;
