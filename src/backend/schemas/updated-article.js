'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {schemaMessages} = require(`../messages`);
const {EArticleFieldName} = require(`../models`);


const {
  MIN_TITLE_SYMBOL_COUNT,
  MAX_TITLE_SYMBOL_COUNT,
  MIN_ANNOUNCE_SYMBOL_COUNT,
  MAX_ANNOUNCE_SYMBOL_COUNT,
  MAX_TEXT_SYMBOL_COUNT,
  MIN_CHOOSE_CATEGORY_ITEMS,
  MAX_IMAGE_NAME_SYMBOL_COUNT,
} = backendParams.db.article;

module.exports = Joi.object({
  [EArticleFieldName.TITLE]: Joi.string()
    .min(MIN_TITLE_SYMBOL_COUNT)
    .max(MAX_TITLE_SYMBOL_COUNT)
    .messages({
      'string.min': schemaMessages.Article.MIN_TITLE_LENGTH,
      'string.max': schemaMessages.Article.MAX_TITLE_LENGTH,
      'any.required': schemaMessages.Article.TITLE_REQUIRED_FIELD,
      'string.empty': schemaMessages.Article.TITLE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.ANNOUNCE]: Joi.string()
    .min(MIN_ANNOUNCE_SYMBOL_COUNT)
    .max(MAX_ANNOUNCE_SYMBOL_COUNT)
    .messages({
      'string.min': schemaMessages.Article.MIN_ANNOUNCE_LENGTH,
      'string.max': schemaMessages.Article.MAX_ANNOUNCE_LENGTH,
      'any.required': schemaMessages.Article.ANNOUNCE_REQUIRED_FIELD,
      'string.empty': schemaMessages.Article.ANNOUNCE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.TEXT]: Joi.string()
    .max(MAX_TEXT_SYMBOL_COUNT)
    .allow(``)
    .messages({
      'string.max': schemaMessages.Article.MAX_TEXT_LENGTH,
    }),
  categories: Joi.array()
    .items(Joi.number())
    .min(MIN_CHOOSE_CATEGORY_ITEMS)
    .messages({
      'array.min': schemaMessages.Article.MIN_CATEGORY_ITEMS,
      'any.required': schemaMessages.Article.MIN_CATEGORY_ITEMS,
    }),
  [EArticleFieldName.IMAGE]: Joi.string()
    .pattern(/.(jpg|png)$/)
    .max(MAX_IMAGE_NAME_SYMBOL_COUNT)
    .allow(``)
    .messages({
      'string.max': schemaMessages.Article.MAX_IMAGE_NAME_LENGTH,
      'string.pattern.base': schemaMessages.Article.IMAGE_EXTENSION,
    }),
  [EArticleFieldName.DATE]: Joi.date()
    .iso()
    .messages({
      'date.format': schemaMessages.Article.DATE_FORMAT,
      'date.empty': schemaMessages.Article.DATE_REQUIRED,
    }),
});
