'use strict';

const {Router} = require(`express`);

const {getSearch} = require(`./methods`);


const apiSearch = new Router();
apiSearch.get(`/`, getSearch);

module.exports = apiSearch;
