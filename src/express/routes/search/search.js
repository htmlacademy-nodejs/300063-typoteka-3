'use strict';

const {Router} = require(`express`);

const searchRoute = new Router();

searchRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Страница поиска личного блога Типотека`,
    account: {
      type: `admin`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    },
    isResult: false,
    searchResult: {
      type: `list`,
      list: [
        {
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          link: {
            text: `Huawei открыла в России путешествия на смартфон Mate 30 Pro без сервисов Google`,
            href: `#`,
          }
        },
        {
          date: {
            stamp: `2019-03-21T20:33`,
            day: `21.03.2019`,
            time: `20:33`
          },
          link: {
            text: `«Яндекс.Метрика» запустила путешествия сервис для оценки эффективности баннеров и видеорекламы в реальном времени`,
            href: `#`,
          }
        },
      ],
    },
    scriptList: [`js/main.js`],
  };
  res.render(`pages/search`, content);
});

module.exports = searchRoute;
