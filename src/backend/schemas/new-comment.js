'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {schemaMessages} = require(`../messages`);
const {ECommentFieldName, EForeignKey} = require(`../models`);


const {MIN_TEXT_SYMBOL_COUNT, MAX_TEXT_SYMBOL_COUNT} = backendParams.db.comment;

const {
  MIN_TEXT_LENGTH,
  MAX_TEXT_LENGTH,
  REQUIRED_TEXT_FIELD,
  REQUIRED_ACCOUNT_ID_FIELD,
  REQUIRED_ARTICLE_ID_FIELD,
} = schemaMessages.Comment;

module.exports = Joi.object({
  [ECommentFieldName.TEXT]: Joi.string()
    .min(MIN_TEXT_SYMBOL_COUNT)
    .max(MAX_TEXT_SYMBOL_COUNT)
    .required()
    .messages({
      'string.min': MIN_TEXT_LENGTH,
      'string.max': MAX_TEXT_LENGTH,
      'any.required': REQUIRED_TEXT_FIELD,
      'string.empty': REQUIRED_TEXT_FIELD,
    }),
  [EForeignKey.ACCOUNT_ID]: Joi.number()
    .required()
    .messages({
      'any.required': REQUIRED_ACCOUNT_ID_FIELD,
    }),
  [EForeignKey.ARTICLE_ID]: Joi.number()
    .required()
    .messages({
      'any.required': REQUIRED_ARTICLE_ID_FIELD,
    }),
});
