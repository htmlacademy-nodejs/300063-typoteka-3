'use strict';

const Joi = require(`@hapi/joi`);

const {ERefreshTokenFieldName} = require(`../models`);

module.exports = Joi.object({
  [ERefreshTokenFieldName.TOKEN]: Joi.string()
    .required()
    .messages({
      'string.required': `Необходимо указать token`,
      'string.empty': `Значение token не может быть пустым`,
    }),
});
