'use strict';

const {articleAdapter, commentAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger} = require(`../../utils`);


class ArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {account, errorMessages, comment: newComment} = req.locals;
    const {articleId} = req.params;
    const article = await articleAdapter.getItemById(articleId);
    const comments = await commentAdapter.getList({
      query: {articleId}
    });
    const content = {
      isPost: true,
      article,
      account,
      scriptList: [`js/main.js`],
      comments,
      errorMessages,
      newComment,
    };
    res.render(`pages/articles/article`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {articleId} = req.params;
    const {text, action} = req.body;
    const {account} = req.locals;

    if (action === `delete`) {
      await articleAdapter.deleteItem(articleId);
      res.redirect(`/${routeName.MY}`);
      return;
    }

    const commentRes = await commentAdapter.addItem({
      text,
      articleId,
      accountId: account.id,
    });

    let path = `/${routeName.ARTICLES}/${articleId}#comments`;
    if (commentRes.content && commentRes.content.errorMessages) {
      const queryParams = {
        comment: {
          text,
        },
        errorMessages: commentRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/${routeName.ARTICLES}/${articleId}?params=${query}#new-comment`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }
}

module.exports = ArticleRoute;
