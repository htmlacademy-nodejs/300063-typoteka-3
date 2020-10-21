'use strict';

const {logger} = require(`../../utils`);
const {articleAdapter} = require(`../../adapters`);


class SearchRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const {title: search = null} = req.query;
    const articleRes = await articleAdapter.getList({
      query: {
        title: encodeURIComponent(search),
      },
    });
    const isEmpty = articleRes.list && articleRes.list.length === 0 && search !== null;
    const content = {
      title: `Типотека`,
      hiddenTitle: ` Страница поиска личного блога Типотека`,
      account,
      search,
      isEmpty,
      articles: articleRes.list,
      scriptList: [`js/main.js`],
    };
    res.render(`pages/search`, content);
    logger.endRequest(req, res);
  }
}

module.exports = SearchRoute;
