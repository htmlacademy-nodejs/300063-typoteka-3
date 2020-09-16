'use strict';

const request = require(`../request`);


class CategoryAdapter {
  getList() {
    return request.get(`categories`);
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
