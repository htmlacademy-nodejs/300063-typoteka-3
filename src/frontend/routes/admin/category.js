'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger} = require(`../../utils`);


class CategoryRoute {
  constructor() {
    this.post = this.post.bind(this);
    this._actionMap = new Map([
      [`save`, this._saveCategory.bind(this)],
      [`delete`, this._deleteCategory.bind(this)],
    ]);
  }

  async post(req, res) {
    const action = this._actionMap.get(req.body.action);
    if (!action) {
      res.status(HttpCodes.BAD_REQUEST);
    } else {
      action(req, res);
    }
    logger.endRequest(req, res);
  }

  async _saveCategory(req, res) {
    const {categoryId} = req.params;
    const {title} = req.body;
    const categoryParams = {
      id: +categoryId,
      title,
    };
    const updatedCategoryRes = await categoryAdapter.updateItem(categoryParams);

    let path = `/${routeName.CATEGORIES}`;
    if (updatedCategoryRes.content && updatedCategoryRes.content.errorMessages) {
      const queryParams = {
        updatedCategory: categoryParams,
        errorMessages: updatedCategoryRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/${routeName.CATEGORIES}?params=${query}`;
    }
    res.redirect(path);
  }

  async _deleteCategory(req, res) {
    const {categoryId} = req.params;
    await categoryAdapter.deleteItem(categoryId);
    res.redirect(`/${routeName.CATEGORIES}`);
  }
}

module.exports = CategoryRoute;
