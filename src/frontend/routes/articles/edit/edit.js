'use strict';

const {Router} = require(`express`);

const {upload} = require(`../../../utils`);
const {getEditArticlePage, postEditArticlePage} = require(`./methods`);


const editRoute = new Router();

editRoute.get(`/:id`, getEditArticlePage);
editRoute.post(`/:id`, upload(`picture`), postEditArticlePage);

module.exports = editRoute;
