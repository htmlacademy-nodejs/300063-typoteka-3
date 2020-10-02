'use strict';

const {EModelName} = require(`./name-space`);


const ECommentFieldName = {
  ID: `id`,
  TEXT: `text`,
  DATE: `createdAt`,
};

const getCommentModel = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model {}
  Comment.init({
    [ECommentFieldName.TEXT]: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.COMMENTS,
    timestamp: true,
    paranoid: true,
  });
  return Comment;
};

module.exports = {
  getCommentModel,
  ECommentFieldName,
};
