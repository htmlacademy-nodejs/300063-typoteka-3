'use strict';

const {appSocket} = require(`./socket`);
const {initArticleEntity, initCommentEntity} = require(`./entities`);


module.exports = (server) => {
  appSocket.init(server);
  initArticleEntity();
  initCommentEntity();
};
