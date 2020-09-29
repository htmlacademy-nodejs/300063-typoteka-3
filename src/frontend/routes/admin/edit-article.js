'use strict';

const {articleAdapter, categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger, transformDate} = require(`../../utils`);


class EditArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    let {account, article, errorMessages} = req.locals;
    const articleRes = await articleAdapter.getItemById(req.params.articleId);
    if (articleRes.content && articleRes.content.errorMessages) {
      res.status(article.statusCode).send();
      return;
    }
    const categories = await categoryAdapter.getList();
    if (!article) {
      article = articleRes;
      article.date = article.date.day;
      article.categories = categories.reduce((acc, category) => {
        if (article.categories.includes(category.title)) {
          acc.push(category.id);
        }
        return acc;
      }, []);
    }

    const content = {
      type: `edit`,
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
    await this._updateArticleItemAndRedirect(req, res);
    logger.endRequest(req, res);
  }

  async _updateArticleItemAndRedirect(req, res) {
    const {date, title, announce, categories, text, image} = req.body;
    const {articleId} = req.params;
    const articleParams = {
      title,
      announce,
      text,
      categories: categories && categories.map((category) => +category),
      image,
      date: transformDate(date),
    };
    const articleRes = await articleAdapter.updateItemById(articleId, articleParams);
    let path = `/${routeName.MY}`;
    if (articleRes.content && articleRes.content.errorMessages) {
      const queryParams = {
        article: {
          ...articleParams,
          id: articleId,
          date,
        },
        errorMessages: articleRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/${routeName.ARTICLES}/${routeName.EDIT}/${articleId}?params=${query}`;
    }
    res.redirect(path);
  }
}

module.exports = EditArticleRoute;
