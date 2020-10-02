'use strict';

const {Router} = require(`express`);

const {postRefreshToken} = require(`./methods`);


const apiRefreshToken = new Router();
apiRefreshToken.post(`/`, postRefreshToken);

module.exports = apiRefreshToken;
