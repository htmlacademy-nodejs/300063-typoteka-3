'use strict';

const {Router} = require(`express`);

const {schemaValidator} = require(`../../../../middleware`);
const {newComment} = require(`../../../../schemas`);
const apiCommentId = require(`./api-comment-id`);
const {getComments, postComments} = require(`./methods`);


const apiComments = new Router({mergeParams: true});
apiComments.use(`/:commentId`, apiCommentId);
apiComments.get(`/`, getComments);
apiComments.post(`/`, schemaValidator(newComment), postComments);

module.exports = apiComments;
