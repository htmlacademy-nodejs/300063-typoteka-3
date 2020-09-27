'use strict';

const {categoryAdapter} = require(`../../adapters`);
const {logger} = require(`../../utils`);


class CategoriesRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {account} = req.locals;
    const categories = await categoryAdapter.getList();
    const {createdCategory, updatedCategory, errorMessages} = req.locals || {};
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
    let path = `/categories`;
    if (createdCategoryRes.content && createdCategoryRes.content.errorMessages) {
      const queryParams = {
        createdCategory: categoryParams,
        errorMessages: createdCategoryRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/categories?params=${query}`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }
}

module.exports = CategoriesRoute;
