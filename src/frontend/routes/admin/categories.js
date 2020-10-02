'use strict';

const {categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger} = require(`../../utils`);


class CategoriesRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const categories = await categoryAdapter.getList();
    const {createdCategory, updatedCategory, errorMessages} = this._parseQueryParams(req);
    const content = {
      account,
      categories,
      createdCategory,
      updatedCategory,
      errorMessages,
    };
    res.render(`pages/categories`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {title} = req.body;
    const categoryParams = {title};
    const createdCategoryRes = await categoryAdapter.addItem(categoryParams);
    let path = `/${routeName.CATEGORIES}`;
    if (createdCategoryRes.content && createdCategoryRes.content.errorMessages) {
      const query = getQueryString({
        createdCategory: JSON.stringify(categoryParams),
        errorMessages: JSON.stringify(createdCategoryRes.content.errorMessages),
      });
      path = `/${routeName.CATEGORIES}?${query}`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _parseQueryParams(req) {
    const {createdCategory, updatedCategory, errorMessages} = req.query;
    return {
      createdCategory: createdCategory && JSON.parse(createdCategory),
      updatedCategory: updatedCategory && JSON.parse(updatedCategory),
      errorMessages: errorMessages && JSON.parse(errorMessages),
    };
  }
}

module.exports = CategoriesRoute;
