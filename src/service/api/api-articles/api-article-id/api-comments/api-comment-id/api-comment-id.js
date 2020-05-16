'use strict';

const {Router} = require(`express`);

const {deleteCommentId} = require(`./methods`);


const apiCommentId = new Router();

apiCommentId.get(`/`, deleteCommentId);

module.exports = apiCommentId;
