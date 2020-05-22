'use strict';

const {Router} = require(`express`);
const {logger} = require(`frontend/utils`);
const {accountAdapter, dateAdapter} = require(`frontend/adapters`);


const searchRoute = new Router();

searchRoute.get(`/`, (req, res) => {
  const content = {
    title: `Типотека`,
    hiddenTitle: ` Страница поиска личного блога Типотека`,
    account: accountAdapter.getAuth(),
    isResult: false,
    searchResult: {
      type: `list`,
      list: [
        {
          date: dateAdapter.get(`2019-03-21 20:33`),
          link: {
            text: `Huawei открыла в России путешествия на смартфон Mate 30 Pro без сервисов Google`,
            href: `#`,
          }
        },
        {
          date: dateAdapter.get(`2019-03-21 20:33`),
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
  logger.endRequest(req, res);
});

module.exports = searchRoute;
