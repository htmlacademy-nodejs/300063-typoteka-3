'use strict';

const {Router} = require(`express`);

const {schemaValidator} = require(`../../middleware`);
const {newUser} = require(`../../schemas`);
const apiLogin = require(`./api-login`);
const apiRefreshToken = require(`./api-refresh`);
const apiLogout = require(`./api-logout`);
const {postUser} = require(`./methods`);


const userRoutes = new Router();
userRoutes.use(`/login`, apiLogin);
userRoutes.use(`/refresh`, apiRefreshToken);
userRoutes.use(`/logout`, apiLogout);
userRoutes.post(`/`, schemaValidator(newUser), postUser);

module.exports = userRoutes;
