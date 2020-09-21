'use strict';

const {Router} = require(`express`);

const {schemaValidator} = require(`../../middleware`);
const {newUser} = require(`../../schemas`);
const apiLogin = require(`./api-login`);
const {postUser} = require(`./methods`);


const userRoutes = new Router();
userRoutes.use(`/login`, apiLogin);
userRoutes.post(`/`, schemaValidator(newUser), postUser);

module.exports = userRoutes;
