'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);
const {accountAdapter} = require(`frontend/adapters`);


const categoryRoute = new Router();

categoryRoute.get(`/:id`, (req, res) => {
  const content = {
    title: `Типотека`,
    displayedTitle: `Бизнес`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: accountAdapter.getAuth(),
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
  };
  res.render(`pages/articles/categories`, content);
  logger.endRequest(req, res);
});

module.exports = categoryRoute;
