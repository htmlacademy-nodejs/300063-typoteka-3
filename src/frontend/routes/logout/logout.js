'use strict';

const {Router} = require(`express`);

const {getLogout} = require(`./methods`);


const logoutRoute = new Router();

logoutRoute.get(`/`, getLogout);

module.exports = logoutRoute;
