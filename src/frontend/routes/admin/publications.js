'use strict';

const {logger} = require(`../../utils`);
const {articleAdapter} = require(`../../adapters`);


class PublicationsRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const articles = await articleAdapter.getList();
    const content = {
      account,
      articleList: articles.list,
    };
    res.render(`pages/my/my`, content);
    logger.endRequest(req, res);
  }
}

module.exports = PublicationsRoute;
