'use strict';

const socketIo = require(`socket.io`);


class AppSocket {
  constructor() {
    this._entityMap = new Map([]);
    this.init = this.init.bind(this);
    this.addEntity = this.addEntity.bind(this);
    this.update = this.update.bind(this);
  }

  init(server) {
    this._io = socketIo(server);
  }

  addEntity(name, Entity) {
    const entity = new Entity(this._io);
    this._entityMap.set(name, entity);
  }

  create(req, entityParams) {
    const {name, room, data} = entityParams;
    this._entityMap
      .get(name)
      .create(req, {room, data});
  }

  update(req, entityParams) {
    const {name, room, data} = entityParams;
    this._entityMap
      .get(name)
      .update(req, {room, data});
  }

  delete(req, entityParams) {
    const {name, room, data} = entityParams;
    this._entityMap
      .get(name)
      .delete(req, {room, data});
  }
}

const appSocket = new AppSocket();

module.exports = {
  appSocket,
};
