'use strict';

const socketIo = require(`socket.io`);


class AppSocket {
  constructor() {
    this._entityMap = new Map([]);
    this.init = this.init.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
  }

  init(server) {
    this.io = socketIo(server);
    this.io.on(`connection`, (socket) => {
      this._socket = socket;
    });
  }

  add(name, Entity) {
    const entity = new Entity();
    this._entityMap.set(name, entity);
  }

  update(req, res, entityName) {
    this._entityMap
      .get(entityName)
      .update(req, res, this.io);
  }
}

const appSocket = new AppSocket();

module.exports = {
  appSocket,
};
