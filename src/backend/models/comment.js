'use strict';

module.exports = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model {}
  Comment.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `comments`,
    timestamp: true,
    paranoid: true,
  });
  return Comment;
};
