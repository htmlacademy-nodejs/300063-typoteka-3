'use strict';

const {Router} = require(`express`);
const {getAddArticlePage, postAddArticlePage} = require(`./methods`);
const {upload} = require(`frontend/utils`);


const addRoute = new Router();

addRoute.get(`/`, getAddArticlePage);
addRoute.post(`/`, upload(`picture`), postAddArticlePage);

module.exports = addRoute;
