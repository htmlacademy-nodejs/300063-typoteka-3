'use strict';

const Joi = require(`@hapi/joi`);

const {ERefreshTokenFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);


const {REQUIRED_TOKEN_FIELD} = schemaMessages.Token;

module.exports = Joi.object({
  [ERefreshTokenFieldName.TOKEN]: Joi.string()
    .required()
    .messages({
      'string.required': REQUIRED_TOKEN_FIELD,
      'string.empty': REQUIRED_TOKEN_FIELD,
    }),
});
