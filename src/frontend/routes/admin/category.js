'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger} = require(`../../utils`);


class CategoryRoute {
  constructor() {
    this.post = this.post.bind(this);
    this._actionMap = new Map([
      [`save`, this._updateCategory.bind(this)],
      [`delete`, this._deleteCategory.bind(this)],
      [`default`, this._sendBadRequestCode.bind(this)]
    ]);
  }

  async post(req, res) {
    const {action = `default`} = req.body;
    this._actionMap.get(action)(req, res);
    logger.endRequest(req, res);
  }

  async _updateCategory(req, res) {
    const {categoryId} = req.params;
    const {title} = req.body;
    const {cookie} = req.headers;
    const categoryParams = {
      id: +categoryId,
      title,
    };
    const updatedCategoryRes = await categoryAdapter.updateItem(categoryParams, {
      headers: {cookie},
    });

    let path = `/${routeName.CATEGORIES}`;
    if (updatedCategoryRes.content && updatedCategoryRes.content.errorMessages) {
      const query = getQueryString({
        updatedCategory: JSON.stringify(categoryParams),
        errorMessages: JSON.stringify(updatedCategoryRes.content.errorMessages),
      });
      path = `/${routeName.CATEGORIES}?${query}`;
    }
    res.redirect(path);
  }

  async _deleteCategory(req, res) {
    const {categoryId} = req.params;
    const {cookie} = req.headers;
    const deletedCategoryRes = await categoryAdapter.deleteItem(categoryId, {
      headers: {cookie},
    });
    const path = this._getPath(deletedCategoryRes, categoryId);
    res.redirect(path);
  }

  _getPath(categoryRes, categoryId) {
    let path = `/${routeName.CATEGORIES}`;
    if (categoryRes.content && categoryRes.content.errorMessages) {
      const query = getQueryString({
        updatedCategory: JSON.stringify({
          id: +categoryId,
        }),
        errorMessages: JSON.stringify(categoryRes.content.errorMessages),
      });
      path = `/${routeName.CATEGORIES}?${query}`;
    }
    return path;
  }

  async _sendBadRequestCode(req, res) {
    res.sendStatus(HttpCodes.BAD_REQUEST);
  }
}
module.exports = CategoryRoute;
