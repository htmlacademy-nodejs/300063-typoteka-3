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

const {
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  TITLE_REQUIRED_FIELD,
  MIN_ANNOUNCE_LENGTH,
  MAX_ANNOUNCE_LENGTH,
  ANNOUNCE_REQUIRED_FIELD,
  MAX_TEXT_LENGTH,
  MIN_CATEGORY_ITEMS,
  MAX_IMAGE_NAME_LENGTH,
  IMAGE_EXTENSION,
  DATE_FORMAT,
  DATE_REQUIRED,
} = schemaMessages.Article;

module.exports = Joi.object({
  [EArticleFieldName.TITLE]: Joi.string()
    .min(MIN_TITLE_SYMBOL_COUNT)
    .max(MAX_TITLE_SYMBOL_COUNT)
    .messages({
      'string.min': MIN_TITLE_LENGTH,
      'string.max': MAX_TITLE_LENGTH,
      'any.required': TITLE_REQUIRED_FIELD,
      'string.empty': TITLE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.ANNOUNCE]: Joi.string()
    .min(MIN_ANNOUNCE_SYMBOL_COUNT)
    .max(MAX_ANNOUNCE_SYMBOL_COUNT)
    .messages({
      'string.min': MIN_ANNOUNCE_LENGTH,
      'string.max': MAX_ANNOUNCE_LENGTH,
      'any.required': ANNOUNCE_REQUIRED_FIELD,
      'string.empty': ANNOUNCE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.TEXT]: Joi.string()
    .max(MAX_TEXT_SYMBOL_COUNT)
    .allow(``)
    .messages({
      'string.max': MAX_TEXT_LENGTH,
    }),
  categories: Joi.array()
    .items(Joi.number())
    .min(MIN_CHOOSE_CATEGORY_ITEMS)
    .messages({
      'array.min': MIN_CATEGORY_ITEMS,
      'any.required': MIN_CATEGORY_ITEMS,
    }),
  [EArticleFieldName.IMAGE]: Joi.string()
    .pattern(/.(jpg|png)$/)
    .max(MAX_IMAGE_NAME_SYMBOL_COUNT)
    .allow(``)
    .messages({
      'string.max': MAX_IMAGE_NAME_LENGTH,
      'string.pattern.base': IMAGE_EXTENSION,
    }),
  [EArticleFieldName.DATE]: Joi.date()
    .iso()
    .messages({
      'date.format': DATE_FORMAT,
      'date.empty': DATE_REQUIRED,
    }),
});
