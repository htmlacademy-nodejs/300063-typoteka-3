'use strict';

const fs = require(`fs`);
const {nanoid} = require(`nanoid`);

const {logger} = require(`backend/utils`);
const {MOCK_FILE_NAME} = require(`common/params`);


const log = logger.getLogger();

class ArticleAdapter {
  constructor() {
    try {
      this._list = JSON.parse(fs.readFileSync(MOCK_FILE_NAME, `utf8`));
      log.debug(`Offer adapter init`);
    } catch (error) {
      log.error(`Can't read file ${MOCK_FILE_NAME} ${error}`);
    }
  }

  getList() {
    return this._list.slice();
  }

  addItem(articleParams) {
    const article = {
      id: nanoid(),
      ...articleParams,
      comments: [],
    };
    this._list.push(article);
    return article;
  }

  getItemById(articleId) {
    const article = this._list.find((item) => item.id === articleId);
    return article || null;
  }

  updateItemById(articleId, articleParams) {
    const articleIndex = this._list.findIndex((article) => article.id === articleId);
    if (articleIndex === -1) {
      return null;
    }
    this._list[articleIndex] = {
      ...this._list[articleIndex],
      ...articleParams,
    };
    return this._list[articleIndex];
  }

  removeItemById(articleId) {
    const articleIndex = this._list.findIndex((article) => article.id === articleId);
    if (articleIndex === -1) {
      return null;
    }
    this._list.splice(articleIndex, 1);
    return {};
  }

  searchByTitle(searchedTitle) {
    const lowerSearchedTitle = searchedTitle.toLowerCase();
    return this._list.filter((article) => {
      const lowerArticleTitle = article.title.toLowerCase();
      return lowerArticleTitle.match(lowerSearchedTitle);
    });
  }
}

module.exports = new ArticleAdapter();
