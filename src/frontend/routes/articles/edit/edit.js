'use strict';

const {Router} = require(`express`);

const {upload} = require(`frontend/utils`);
const {getEditArticlePage, postEditArticlePage} = require(`./methods`);


const editRoute = new Router();

editRoute.get(`/:id`, getEditArticlePage);
editRoute.post(`/:id`, upload(`image`), postEditArticlePage);

module.exports = editRoute;
