'use strict';

const request = require(`../request`);


class CategoryAdapter {
  getList(params) {
    return request.get(`categories`, params);
  }

  addItem(categoryParams) {
    return request.post(`categories`, categoryParams);
  }

  updateItem(categoryParams) {
    const {id, title} = categoryParams;
    return request.put(`categories/${id}`, {title});
  }

  deleteItem(categoryId) {
    return request.delete(`categories/${categoryId}`);
  }
}

module.exports = new CategoryAdapter();
