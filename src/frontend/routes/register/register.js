'use strict';

const {Router} = require(`express`);

const {getRegisterPage} = require(`./methods`);


const registerRoute = new Router();

registerRoute.get(`/`, getRegisterPage);

module.exports = registerRoute;
