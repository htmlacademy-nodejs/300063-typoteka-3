'use strict';

const request = require(`../request`);
const {adaptDate} = require(`../../utils`);


class ArticleAdapter {
  async getList(params) {
    let path = `articles`;
    const articlesRes = await request.get(path, params);
    const articles = articlesRes.data;
    articles.list = articles.list.map(this._adaptArticle);
    return articles;
  }

  async addItem(articleBody, params) {
    const res = await request.post(`articles`, articleBody, params);
    return res.data;
  }

  async getItemById(articleId) {
    const articleRes = await request.get(`articles/${articleId}`);
    return this._adaptArticle(articleRes.data);
  }

  async deleteItem(articleId, params) {
    const res = await request.delete(`articles/${articleId}`, params);
    return res.data;
  }

  async updateItemById(articleId, articleBody, params) {
    const res = await request.put(`articles/${articleId}`, articleBody, params);
    return res.data;
  }

  _adaptArticle(article) {
    return {
      ...article,
      date: adaptDate(article.date),
    };
  }
}

module.exports = new ArticleAdapter();
