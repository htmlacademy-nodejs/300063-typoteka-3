'use strict';

const request = require(`../request`);


class CategoryAdapter {
  getList() {
    return request.get(`categories`);
  }
}

module.exports = new CategoryAdapter();
