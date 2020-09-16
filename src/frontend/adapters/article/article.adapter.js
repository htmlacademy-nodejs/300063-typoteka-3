'use strict';

const {ONE_PAGE_LIMIT} = require(`../../../common/params`);
const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList() {
    const articles = await request.get(`articles`);
    articles.list = articles.list.map(this._adaptArticle);
    return articles;
  }

  async getPartList(page) {
    const articles = await request.get(`articles?limit=${ONE_PAGE_LIMIT}&page=${page}`);
    articles.list = articles.list.map(this._adaptArticle);
    return articles;
  }

  addItem(params) {
    return request.post(`articles`, params);
  }

  async getItemById(articleId) {
    const article = await request.get(`articles/${articleId}`);
    return this._adaptArticle(article);
  }

  async updateItemById(articleId, params) {
    return await request.put(`articles/${articleId}`, params);
  }

  async searchByTitle(title) {
    let articleList = await request.get(`search?title=${encodeURI(title)}`);
    if (articleList.statusCode >= 400) {
      articleList = [];
    }
    return articleList.map(this._adaptArticle);
  }

  _adaptArticle(article) {
    return {
      ...article,
      date: dateAdapter.get(article.date),
    };
  }
}

module.exports = new ArticleAdapter();
