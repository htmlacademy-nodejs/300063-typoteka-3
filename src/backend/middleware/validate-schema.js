'use strict';

const HttpCodes = require(`http-status-codes`);


module.exports = (paramName) => (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[paramName], {abortEarly: false});
  } catch (error) {
    const {details} = error;
    res.status(HttpCodes.BAD_REQUEST).json({
      errorMessages: details.map((errorDescription) => errorDescription.message)
    });
    return;
  }
  next();
};
