'use strict';

const {Router} = require(`express`);

const {upload} = require(`../../../utils`);
const {getAddArticlePage, postAddArticlePage} = require(`./methods`);


const addRoute = new Router();

addRoute.get(`/`, getAddArticlePage);
addRoute.post(`/`, upload(`picture`), postAddArticlePage);

module.exports = addRoute;
