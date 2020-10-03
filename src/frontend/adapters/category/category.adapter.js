'use strict';

const request = require(`../request`);


class CategoryAdapter {
  async getList(params) {
    const res = await request.get(`categories`, params);
    return res.data;
  }

  async addItem(categoryBody, params) {
    const res = await request.post(`categories`, categoryBody, params);
    return res.data;
  }

  async updateItem(categoryBody, params) {
    const {id, title} = categoryBody;
    const res = await request.put(`categories/${id}`, {title}, params);
    return res.data;
  }

  async deleteItem(categoryId, params) {
    const res = await request.delete(`categories/${categoryId}`, params);
    return res.data;
  }
}

module.exports = new CategoryAdapter();
