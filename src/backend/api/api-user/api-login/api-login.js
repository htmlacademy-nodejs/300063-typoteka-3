'use strict';

const {Router} = require(`express`);

const {schemaValidator, authenticationMiddleware} = require(`../../../middleware`);
const {loginSchema} = require(`../../../schemas`);
const {postLogin} = require(`./methods`);


const apiLogin = new Router();
apiLogin.post(`/`, [schemaValidator(loginSchema), authenticationMiddleware], postLogin);

module.exports = apiLogin;
