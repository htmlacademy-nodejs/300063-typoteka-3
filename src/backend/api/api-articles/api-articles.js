'use strict';

const {Router} = require(`express`);

const apiArticleId = require(`./api-article-id`);
const {getArticles, postArticles} = require(`./methods`);


const apiArticles = new Router();
apiArticles.use(`/:articleId`, apiArticleId);
apiArticles.get(`/`, getArticles);
apiArticles.post(`/`, postArticles);

module.exports = apiArticles;
