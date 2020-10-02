'use strict';

const {Router} = require(`express`);

const {getLoginPage} = require(`./methods`);


const loginRoute = new Router();

loginRoute.get(`/`, getLoginPage);

module.exports = loginRoute;
