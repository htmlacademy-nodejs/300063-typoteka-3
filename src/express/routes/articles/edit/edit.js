'use strict';

const {Router} = require(`express`);

const editRoute = new Router();

editRoute.get(`/:id`, (req, res) => res.send(`/articles/edit/:id`));

module.exports = editRoute;
