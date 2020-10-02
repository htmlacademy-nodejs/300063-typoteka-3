'use strict';

const {Router} = require(`express`);

const {getComments, deleteComment} = require(`./methods`);

const {paramsValidator} = require(`../../middleware`);
const {getRouteParamsValidationSchema} = require(`../../utils`);


const routeParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`commentId`]));

const apiComments = new Router();
apiComments.get(`/`, getComments);
apiComments.delete(`/:commentId`, routeParamsValidationMiddleware, deleteComment);

module.exports = apiComments;
