'use strict';

const {Router} = require(`express`);

const apiArticleId = require(`./api-article-id`);
const {getArticles, postArticles} = require(`./methods`);
const {schemaValidator} = require(`../../middleware`);
const {newArticleSchema} = require(`../../schemas`);


const apiArticles = new Router();
apiArticles.use(`/:articleId`, apiArticleId);
apiArticles.get(`/`, getArticles);
apiArticles.post(`/`, schemaValidator(newArticleSchema), postArticles);

module.exports = apiArticles;
