'use strict';

const Joi = require(`@hapi/joi`);

const {EAccountFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  [EAccountFieldName.EMAIL]: Joi.string()
  .required()
  .messages({
    'any.required': schemaMessages.Login.REQUIRED_EMAIL_FIELD,
    'string.empty': schemaMessages.Login.REQUIRED_EMAIL_FIELD,
  }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .required()
    .messages({
      'any.required': schemaMessages.Login.REQUIRED_PASSWORD_FIELD,
      'string.empty': schemaMessages.Login.REQUIRED_PASSWORD_FIELD,
    }),
});
