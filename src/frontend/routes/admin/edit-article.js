'use strict';

const {articleAdapter, categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger, transformDate} = require(`../../utils`);


class EditArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    let {article, errorMessages} = this._parseQueryParams(req);
    const articleRes = await articleAdapter.getItemById(req.params.articleId);
    if (articleRes.content && articleRes.content.errorMessages) {
      res.redirect(`/${routeName.NOT_FOUND}`);
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
    const {date, title, announce, categories, text, image} = req.body;
    const {cookie} = req.headers;
    const {articleId} = req.params;
    const articleParams = {
      title,
      announce,
      text,
      categories: categories && categories.map((category) => +category),
      image,
      date,
    };
    const articleRes = await articleAdapter.updateItemById(articleId, {
      ...articleParams,
      date: transformDate(date),
    }, {
      headers: {cookie},
    });
    const path = this._getPath(articleRes, {
      ...articleParams,
      id: articleId,
    });
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _parseQueryParams(req) {
    let {article, errorMessages} = req.query;
    if (article) {
      article = JSON.parse(article);
    }
    if (errorMessages) {
      errorMessages = JSON.parse(errorMessages);
    }
    return {article, errorMessages};
  }

  _getPath(articleRes, articleParams) {
    const {id} = articleParams;
    let path = `/${routeName.MY}`;
    if (articleRes.content && articleRes.content.errorMessages) {
      const query = getQueryString({
        article: JSON.stringify(articleParams),
        errorMessages: JSON.stringify(articleRes.content.errorMessages),
      });
      path = `/${routeName.ARTICLES}/${routeName.EDIT}/${id}?${query}`;
    }
    return path;
  }
}

module.exports = EditArticleRoute;
