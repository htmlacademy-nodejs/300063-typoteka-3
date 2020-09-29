'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {schemaMessages} = require(`../messages`);
const {ECommentFieldName, EForeignKey} = require(`../models`);


module.exports = Joi.object({
  [ECommentFieldName.TEXT]: Joi.string()
    .max(backendParams.db.comment.MAX_TEXT_SYMBOL_COUNT)
    .required()
    .messages({
      'string.max': schemaMessages.Comment.MAX_TEXT_LENGTH,
      'any.required': schemaMessages.Comment.REQUIRED_TEXT_FIELD,
      'string.empty': schemaMessages.Comment.REQUIRED_TEXT_FIELD,
    }),
  [EForeignKey.ACCOUNT_ID]: Joi.number()
    .required()
    .messages({
      'any.required': schemaMessages.Comment.REQUIRED_ACCOUNT_ID_FIELD,
    }),
  [EForeignKey.ARTICLE_ID]: Joi.number()
    .required()
    .messages({
      'any.required': schemaMessages.Comment.REQUIRED_ARTICLE_ID_FIELD,
    }),
});
