'use strict';

const Joi = require(`@hapi/joi`);


module.exports = (fieldNames) => {
  const validationParams = fieldNames.reduce((acc, field) => {
    return {
      ...acc,
      [field]: Joi.number()
        .messages({
          'number.base': `${field} должнен быть числом`
        }),
    };
  }, {});
  return Joi.object(validationParams);
};
