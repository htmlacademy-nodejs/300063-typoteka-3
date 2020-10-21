'use strict';

const {frontendParams} = require(`../../../common/params`);
const {articleAdapter} = require(`../../adapters`);


const ArticleSocketEvent = {
  ARTICLES: `articles`,
  HOT_ARTICLES: `hot-articles`,
};

class ArticleSocket {
  constructor(socket) {
    this._socket = socket;
    this.update = this.update.bind(this);
  }

  async update(req, params) {
    const article = await this._getArticle(req, params);
    const hotArticles = await this._getHotArticles();
    this._socket.emit(ArticleSocketEvent.ARTICLES, article);
    this._socket.emit(ArticleSocketEvent.HOT_ARTICLES, hotArticles.list);
  }

  async _getArticle(req, params) {
    const {articleId} = params.data;
    return await articleAdapter.getItemById(articleId, {
      headers: {
        cookie: req.headers.cookie,
      },
    });
  }

  async _getHotArticles() {
    const articlesRes = await articleAdapter.getList({
      query: {
        limit: frontendParams.HOT_ARTICLE_COUNT,
        sort: `commentCount`,
        minCommentCount: 1,
      },
    });
    articlesRes.list = articlesRes.list.map((hotArticle) => ({
      ...hotArticle,
      announce: hotArticle.announce.length > frontendParams.LAST_COMMENT_LETTERS
        ? `${hotArticle.announce.slice(0, frontendParams.HOT_ARTICLE_ANNOUNCE_LETTER)}...`
        : hotArticle.announce,
    }));
    return articlesRes;
  }
}

module.exports = ArticleSocket;
