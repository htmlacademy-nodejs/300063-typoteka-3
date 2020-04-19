'use strict';

const {Router} = require(`express`);

const categoriesRoute = new Router();

categoriesRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    displayedTitle: `Бизнес`,
    description: `Это приветственный текст, который владелец блога может выбрать, чтобы описать себя 👏`,
    account: {
      type: `admin`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    },
    script: {
      vendor: false,
      main: false,
    },
    hasContent: true,
    hasHot: true,
    hasLastComments: true,
  };
  res.render(`pages/categories`, content);
});

module.exports = categoriesRoute;
