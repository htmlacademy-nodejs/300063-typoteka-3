'use strict';

const Joi = require(`@hapi/joi`);

const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  title: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': schemaMessages.Article.MIN_TITLE_LENGTH,
      'string.max': schemaMessages.Article.MAX_TITLE_LENGTH,
      'any.required': schemaMessages.Common.REQUIRED_FIELD,
    }),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required()
    .messages({
      'string.min': schemaMessages.Article.MIN_ANNOUNCE_LENGTH,
      'string.max': schemaMessages.Article.MAX_ANNOUNCE_LENGTH,
      'any.required': schemaMessages.Common.REQUIRED_FIELD,
    }),
  text: Joi.string()
    .max(1000)
    .messages({
      'string.max': schemaMessages.Article.MAX_TEXT_LENGTH,
    }),
  categories: Joi.array()
    .items(Joi.number())
    .min(1)
    .required()
    .messages({
      'array.min': schemaMessages.Article.MIN_CATEGORY_ITEMS,
      'any.required': schemaMessages.Common.EMPTY_VALUE,
    }),
  image: Joi.string()
    .pattern(/.(jpg|png)$/)
    .messages({
      'string.pattern.name': schemaMessages.Article.IMAGE_EXTENSION,
    }),
  createdAt: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': schemaMessages.Article.DATE_FORMAT,
    }),
});
