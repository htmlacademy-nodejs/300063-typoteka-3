'use strict';

const {articleAdapter, commentAdapter, categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {appSocket, EntityName} = require(`../../socket`);
const {getQueryString, logger} = require(`../../utils`);


class ArticleRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this._actionMap = new Map([
      [`delete`, this._deleteArticle.bind(this)],
      [`addComment`, this._addComment.bind(this)]
    ]);
  }

  async get(req, res) {
    const {account} = req.locals;
    const {comment: newComment, errorMessages} = this._getQueryParams(req);
    const {articleId} = req.params;
    const article = await articleAdapter.getItemById(articleId, {
      headers: {
        cookie: req.headers.cookie,
      }
    });
    if (article.content && article.content.errorMessages) {
      res.redirect(`/${routeName.NOT_FOUND}`);
    }
    const comments = await commentAdapter.getList({
      query: {articleId},
    });
    const categories = await categoryAdapter.getList({
      query: {articleId},
      headers: {
        cookie: req.headers.cookie,
      },
    });
    const content = {
      account,
      isPost: true,
      article,
      categories,
      comments,
      scriptList: [
        `js/main.js`,
        `js/socket.io.js`,
        `js/delete-comment.js`,
      ],
      errorMessages,
      newComment,
    };
    res.render(`pages/articles/article`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {action = `addComment`} = req.body;
    this._actionMap.get(action)(req, res);
    logger.endRequest(req, res);
  }

  _getQueryParams(req) {
    const {comment, errorMessages} = req.query;
    return {
      comment: comment && JSON.parse(comment),
      errorMessages: errorMessages && JSON.parse(errorMessages),
    };
  }

  async _deleteArticle(req, res) {
    const {articleId} = req.params;
    const {cookie} = req.headers;
    await articleAdapter.deleteItem(articleId, {
      headers: {cookie},
    });
    res.redirect(`/${routeName.MY}`);
  }

  async _addComment(req, res) {
    const {account} = req.locals;
    const {articleId} = req.params;
    const {text} = req.body;
    const {cookie} = req.headers;

    const commentData = {
      text,
      articleId,
      accountId: account.id,
    };
    const commentRes = await commentAdapter.addItem(commentData, {
      headers: {cookie},
    });
    const path = this._getPath(commentRes, commentData);
    if (!commentRes.content || !commentRes.content.errorMessages) {
      await appSocket.update(req, {name: EntityName.COMMENTS});
      await appSocket.create(req, {
        name: EntityName.COMMENTS,
        data: commentRes,
      });
      await appSocket.update(req, {
        name: EntityName.ARTICLES,
        data: {articleId},
      });
    }
    res.redirect(path);
  }

  _getPath(commentRes, commentData) {
    const {text, articleId} = commentData;
    let path = `/${routeName.ARTICLES}/${articleId}#comments`;
    if (commentRes.content && commentRes.content.errorMessages) {
      const query = getQueryString({
        comment: JSON.stringify({text}),
        errorMessages: JSON.stringify(commentRes.content.errorMessages),
      });
      path = `/${routeName.ARTICLES}/${articleId}?${query}#new-comment`;
    }
    return path;
  }
}

module.exports = ArticleRoute;
