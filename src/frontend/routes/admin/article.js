'use strict';

const {articleAdapter, commentAdapter, categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger} = require(`../../utils`);


class ArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const {comment: newComment, errorMessages} = this._getQueryParams(req);
    const {articleId} = req.params;
    const article = await articleAdapter.getItemById(articleId);
    const comments = await commentAdapter.getList({
      query: {articleId}
    });
    const categories = await categoryAdapter.getList({
      query: {articleId}
    });
    const content = {
      account,
      isPost: true,
      article,
      categories,
      comments,
      scriptList: [`js/main.js`],
      errorMessages,
      newComment,
    };
    res.render(`pages/articles/article`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {account} = req.locals;
    const {articleId} = req.params;
    const {text, action} = req.body;
    const {cookie} = req.headers;

    const additionalParams = {
      headers: {cookie},
    };
    if (action === `delete`) {
      await articleAdapter.deleteItem(articleId, additionalParams);
      res.redirect(`/${routeName.MY}`);
      return;
    }

    const commentParams = {
      text,
      articleId,
      accountId: account.id,
    };
    const commentRes = await commentAdapter.addItem(commentParams, additionalParams);

    let path = `/${routeName.ARTICLES}/${articleId}#comments`;
    if (commentRes.content && commentRes.content.errorMessages) {
      const query = getQueryString({
        comment: JSON.stringify({
          text,
        }),
        errorMessages: JSON.stringify(commentRes.content.errorMessages),
      });
      path = `/${routeName.ARTICLES}/${articleId}?${query}#new-comment`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _getQueryParams(req) {
    const {comment, errorMessages} = req.query;
    return {
      comment: comment && JSON.parse(comment),
      errorMessages: errorMessages && JSON.parse(errorMessages),
    };
  }
}

module.exports = ArticleRoute;
