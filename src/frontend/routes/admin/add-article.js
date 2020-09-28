'use strict';

const {articleAdapter, categoryAdapter} = require(`../../adapters`);
const {logger, transformDate, adaptDate} = require(`../../utils`);


class AddArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    let {account, errorMessages, article} = req.locals;
    const categories = await categoryAdapter.getList();
    if (!article) {
      article = {
        date: adaptDate(new Date().toISOString()).day,
      };
    }
    const content = {
      type: `add`,
      article,
      account,
      categories,
      scriptList: [
        `js/vendor.js`,
        `js/main.js`
      ],
      errorMessages,
    };
    res.render(`pages/articles/edit`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    await this._addArticleItemAndRedirectToMyArticles(req, res);
    logger.endRequest(req, res);
  }

  async _addArticleItemAndRedirectToMyArticles(req, res) {
    const {date, title, announce, categories, text, image} = req.body;
    const articleParams = {
      title,
      announce,
      text,
      categories: categories ? categories.map((category) => +category) : [],
      image,
      date: transformDate(date),
    };
    const articleRes = await articleAdapter.addItem(articleParams);
    let path = `/my`;
    if (articleRes.content && articleRes.content.errorMessages) {
      const queryParams = {
        article: {
          ...articleParams,
          date,
        },
        errorMessages: articleRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/articles/add?params=${query}`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }
}

module.exports = AddArticleRoute;
