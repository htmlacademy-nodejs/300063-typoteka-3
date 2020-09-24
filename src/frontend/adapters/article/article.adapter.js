'use strict';

const request = require(`../request`);
const {dateAdapter} = require(`../date`);


class ArticleAdapter {
  async getList(params) {
    let path = `articles`;
    const articlesRes = await request.get(path, params);
    const articles = articlesRes.data;
    articles.list = articles.list.map(this._adaptArticle);
    return articles;
  }

  async addItem(params) {
    const res = await request.post(`articles`, params);
    return res.data;
  }

  async getItemById(articleId) {
    const articleRes = await request.get(`articles/${articleId}`);
    return this._adaptArticle(articleRes.data);
  }

  async deleteItem(articleId) {
    const res = await request.delete(`articles/${articleId}`);
    return res.data;
  }

  async updateItemById(articleId, params) {
    const res = await request.put(`articles/${articleId}`, params);
    return res.data;
  }

  _adaptArticle(article) {
    return {
      ...article,
      date: dateAdapter.get(article.date),
    };
  }
}

module.exports = new ArticleAdapter();
