'use strict';

const {Router} = require(`express`);

const {upload} = require(`../../../utils`);
const {queryParamsMiddleware} = require(`../../../middleware`);
const {getEditArticlePage, postEditArticlePage} = require(`./methods`);


const editRoute = new Router();

editRoute.get(`/:articleId`, queryParamsMiddleware([`article`, `errorMessages`]), getEditArticlePage);
editRoute.post(`/:articleId`, upload(`picture`), postEditArticlePage);

module.exports = editRoute;
