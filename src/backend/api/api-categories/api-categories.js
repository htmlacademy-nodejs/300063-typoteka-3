'use strict';

const {Router} = require(`express`);

const {getCategories} = require(`./methods`);


const apiCategories = new Router();
apiCategories.get(`/`, getCategories);

module.exports = apiCategories;
