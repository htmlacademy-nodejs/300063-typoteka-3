'use strict';

const {Router} = require(`express`);

const {upload} = require(`../../../utils`);
const {queryParamsMiddleware} = require(`../../../middleware`);
const {getAddArticlePage, postAddArticlePage} = require(`./methods`);


const addRoute = new Router();

addRoute.get(`/`, queryParamsMiddleware([`article`, `errorMessages`]), getAddArticlePage);
addRoute.post(`/`, upload(`picture`), postAddArticlePage);

module.exports = addRoute;
