'use strict';

const {Router} = require(`express`);

const categoryRoute = new Router();

categoryRoute.get(`/:id`, (req, res) => {
  const content = {
    title: `Типотека`,
    displayedTitle: `Бизнес`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: {
      type: `user`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    },
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
  };
  res.render(`pages/articles/categories`, content);
});

module.exports = categoryRoute;
