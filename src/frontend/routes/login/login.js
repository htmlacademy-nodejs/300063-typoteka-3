'use strict';

const {Router} = require(`express`);

const {getLoginPage, postLogin} = require(`./methods`);


const loginRoute = new Router();

loginRoute.get(`/`, getLoginPage);
loginRoute.post(`/`, postLogin);

module.exports = loginRoute;
