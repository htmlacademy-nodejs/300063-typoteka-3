'use strict';

const {Router} = require(`express`);

const {getComments, deleteComment} = require(`./methods`);


const apiComments = new Router();
apiComments.get(`/`, getComments);
apiComments.delete(`/:commentId`, deleteComment);

module.exports = apiComments;
