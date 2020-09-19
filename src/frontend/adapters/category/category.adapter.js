'use strict';

const request = require(`../request`);


class CategoryAdapter {
  getList(queryParams) {
    return request.get(`categories`, queryParams);
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
