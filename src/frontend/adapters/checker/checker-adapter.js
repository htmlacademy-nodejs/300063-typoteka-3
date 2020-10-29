'use strict';

const request = require(`../request`);


class CheckerAdapter {
  async monitorServer() {
    const res = await request.get(`check/server`);
    return !(res.data.content && res.data.content.errorMessages);
  }
}

module.exports = new CheckerAdapter();
