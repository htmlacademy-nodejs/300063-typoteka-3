'use strict';

const {Router} = require(`express`);

const apiCommentId = require(`./api-comment-id`);
const {getComments, postComments} = require(`./methods`);


const apiComments = new Router();
apiComments.use(`/:commentId`, apiCommentId);
apiComments.get(`/`, getComments);
apiComments.post(`/`, postComments);

module.exports = apiComments;
