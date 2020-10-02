'use strict';

const {Router} = require(`express`);

const {schemaValidator, paramsValidator} = require(`../../middleware`);
const {newUser} = require(`../../schemas`);
const {getRouteParamsValidationSchema} = require(`../../utils`);
const apiLogin = require(`./api-login`);
const apiRefreshToken = require(`./api-refresh`);
const apiLogout = require(`./api-logout`);
const {getUsers, postUser} = require(`./methods`);


const userRoutes = new Router();
userRoutes.use(`/login`, apiLogin);
userRoutes.use(`/refresh`, apiRefreshToken);
userRoutes.use(`/logout`, apiLogout);

const routeParamsValidationMiddleware = paramsValidator(getRouteParamsValidationSchema([`userId`]));
userRoutes.get(`/:userId`, routeParamsValidationMiddleware, getUsers);
userRoutes.post(`/`, schemaValidator(newUser), postUser);

module.exports = userRoutes;
