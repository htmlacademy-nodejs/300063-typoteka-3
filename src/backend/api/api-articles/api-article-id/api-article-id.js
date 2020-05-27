'use strict';

const {Router} = require(`express`);

const apiComments = require(`./api-comments`);
const {getArticleId, putArticleId, deleteArticleId} = require(`./methods`);


const apiArticleId = new Router({mergeParams: true});
apiArticleId.use(`/comments`, apiComments);
apiArticleId.get(`/`, getArticleId);
apiArticleId.put(`/`, putArticleId);
apiArticleId.delete(`/`, deleteArticleId);

module.exports = apiArticleId;
