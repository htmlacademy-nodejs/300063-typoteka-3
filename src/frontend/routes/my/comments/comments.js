'use strict';

const {Router} = require(`express`);
const {getCommentPage} = require(`./methods`);


const commentsRoute = new Router();

commentsRoute.get(`/`, getCommentPage);

module.exports = commentsRoute;
