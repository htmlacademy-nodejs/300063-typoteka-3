'use strict';

const request = require(`../request`);


class CategoryAdapter {
  async getList(params) {
    console.log(params);
    const res = await request.get(`categories`, params);
    console.log(res);
    return res.data;
  }

  async addItem(categoryParams) {
    const res = await request.post(`categories`, categoryParams);
    console.log(res.data);
    return res.data;
  }

  async updateItem(categoryParams) {
    const {id, title} = categoryParams;
    const res = await request.put(`categories/${id}`, {title});
    return res.data;
  }

  async deleteItem(categoryId) {
    const res = await request.delete(`categories/${categoryId}`);
    return res.data;
  }
}

module.exports = new CategoryAdapter();
