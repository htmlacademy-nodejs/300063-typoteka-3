'use strict';

const Joi = require(`@hapi/joi`);

const {schemaMessages} = require(`../messages`);
const {EArticleFieldName} = require(`../models`);


module.exports = Joi.object({
  [EArticleFieldName.TITLE]: Joi.string()
    .min(30)
    .max(250)
    .messages({
      'string.min': schemaMessages.Article.MIN_TITLE_LENGTH,
      'string.max': schemaMessages.Article.MAX_TITLE_LENGTH,
      'string.empty': schemaMessages.Article.TITLE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.ANNOUNCE]: Joi.string()
    .min(30)
    .max(250)
    .messages({
      'string.min': schemaMessages.Article.MIN_ANNOUNCE_LENGTH,
      'string.max': schemaMessages.Article.MAX_ANNOUNCE_LENGTH,
      'string.empty': schemaMessages.Article.ANNOUNCE_REQUIRED_FIELD,
    }),
  [EArticleFieldName.TEXT]: Joi.string()
    .max(1000)
    .allow(``)
    .messages({
      'string.max': schemaMessages.Article.MAX_TEXT_LENGTH,
    }),
  categories: Joi.array()
    .items(Joi.number())
    .min(1)
    .messages({
      'array.min': schemaMessages.Article.MIN_CATEGORY_ITEMS,
    }),
  [EArticleFieldName.IMAGE]: Joi.string()
    .pattern(/.(jpg|png)$/)
    .allow(``)
    .messages({
      'string.pattern.name': schemaMessages.Article.IMAGE_EXTENSION,
    }),
  [EArticleFieldName.DATE]: Joi.date()
    .iso()
    .messages({
      'date.format': schemaMessages.Article.DATE_FORMAT,
      'date.empty': schemaMessages.Article.DATE_REQUIRED,
    }),
});
