'use strict';

const EntityName = require(`./entity-name`);
const {appSocket} = require(`./socket`);
const {ArticleSocket, CommentSocket} = require(`./entities`);


module.exports = (server) => {
  appSocket.init(server);
  appSocket.addEntity(EntityName.ARTICLES, ArticleSocket);
  appSocket.addEntity(EntityName.COMMENTS, CommentSocket);
};
