'use strict';

const {Router} = require(`express`);

const {authenticationJwtMiddleware} = require(`../../../middleware`);
const {postLogout} = require(`./methods`);


const apiLogout = new Router();
apiLogout.post(`/`, authenticationJwtMiddleware, postLogout);

module.exports = apiLogout;
