'use strict';

class AccountAdapter {
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
