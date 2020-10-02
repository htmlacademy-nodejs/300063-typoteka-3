'use strict';

const {Router} = require(`express`);

const {postUser} = require(`./methods`);
const {schemaValidator} = require(`../../middleware`);
const {newUser} = require(`../../schemas`);


const userRoutes = new Router();
userRoutes.post(`/`, schemaValidator(newUser), postUser);

module.exports = userRoutes;
