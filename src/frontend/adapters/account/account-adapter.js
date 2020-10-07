'use strict';

const request = require(`../request`);

class AccountAdapter {
  async getItemById(userId) {
    const res = await request.get(`user/${userId}`);
    return res.data;
  }

  async addItem(UserParams) {
    const res = await request.post(`user`, UserParams);
    return res.data;
  }

  async login(loginParams) {
    const res = await request.post(`user/login`, loginParams);
    return res.headers ? res.headers[`set-cookie`] : res.data;
  }

  async refreshToken(params) {
    const res = await request.post(`user/refresh`, null, params);
    return res.headers ? res.headers[`set-cookie`] : res.data;
  }

  async logout(params) {
    const res = await request.post(`user/logout`, null, params);
    return res.headers ? res.headers[`set-cookie`] : res.data;
  }
}

module.exports = new AccountAdapter();
