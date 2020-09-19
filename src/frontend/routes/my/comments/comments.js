'use strict';

const {Router} = require(`express`);

const {getCommentPage, postComment} = require(`./methods`);


const commentsRoute = new Router();

commentsRoute.get(`/`, getCommentPage);
commentsRoute.post(`/:commentId`, postComment);

module.exports = commentsRoute;
