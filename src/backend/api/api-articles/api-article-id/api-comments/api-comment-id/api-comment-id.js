'use strict';

const {Router} = require(`express`);

const {deleteCommentId} = require(`./methods`);


const apiCommentId = new Router({mergeParams: true});

apiCommentId.delete(`/`, deleteCommentId);

module.exports = apiCommentId;
