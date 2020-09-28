'use strict';

const Joi = require(`@hapi/joi`);

const {EAccountFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  [EAccountFieldName.FIRSTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_FIRSTNAME_FIELD,
      'string.max': schemaMessages.User.MAX_FIRSTNAME_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_FIRSTNAME_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_FIRSTNAME_FIELD,
    }),
  [EAccountFieldName.LASTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_LASTNAME_FIELD,
      'string.max': schemaMessages.User.MAX_LASTNAME_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_LASTNAME_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_LASTNAME_FIELD,
    }),
  [EAccountFieldName.EMAIL]: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': schemaMessages.User.INVALID_EMAIL,
      'string.max': schemaMessages.User.MAX_EMAIL_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_EMAIL_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_EMAIL_FIELD,
    }),
  [EAccountFieldName.AVATAR]: Joi.string()
    .max(100)
    .allow(``)
    .pattern(/.(jpg|png)$/)
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_AVATAR_FIELD,
      'string.max': schemaMessages.User.MAX_AVATAR_LENGTH,
    }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': schemaMessages.User.MIN_PASSWORD_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_PASSWORD_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_PASSWORD_FIELD,
    }),
  repeatedPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': schemaMessages.User.MIN_REPEAT_PASSWORD_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_REPEAT_PASSWORD_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_REPEAT_PASSWORD_FIELD,
    }),
});
