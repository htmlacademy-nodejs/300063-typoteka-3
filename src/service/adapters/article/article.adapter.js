'use strict';

const fs = require(`fs`);
const {nanoid} = require(`nanoid`);

const {logger} = require(`service/utils`);
const {MOCK_FILE_NAME} = require(`service/constants`);


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
    return this._list;
  }

  addItem(articleParams) {
    this._list.push({
      id: nanoid(),
      ...articleParams,
      comments: [],
    });
  }

  getItemById(articleId) {
    return this._list.find((article) => article.id === articleId);
  }

  updateItemById(articleId, articleParams) {
    const articleIndex = this._list.findIndex((article) => article.id === articleId);
    this._list[articleIndex] = {
      ...this._list[articleIndex],
      ...articleParams,
    };
  }

  removeItemById(articleId) {
    this._list = this._list.filter((article) => article.id !== articleId);
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
