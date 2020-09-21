'use strict';

const request = require(`../request`);

class AccountAdapter {
  async addItem(UserParams) {
    return await request.post(`user`, UserParams);
  }

  getAuth() {
    return {
      type: `user`,
      name: `Алёна Фролова`,
      avatar: `img/avatar-2.png`,
    };
  }

  getUserById(userId) {
    return {
      type: `user`,
      avatar: `img/avatar-${userId}.png`,
      name: `Евгений Петров`,
    };
  }
}

module.exports = new AccountAdapter();
