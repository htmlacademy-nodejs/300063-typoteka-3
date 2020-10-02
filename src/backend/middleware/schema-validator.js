'use strict';

const HttpCodes = require(`http-status-codes`);


module.exports = (schema) => async (req, res, next) => {
  const {body} = req;
  try {
    await schema.validateAsync(body, {abortEarly: false});
  } catch (error) {
    const {details} = error;
    res.status(HttpCodes.BAD_REQUEST).json({
      errorMessages: details.map((errorDescription) => errorDescription.message)
    });
    return;
  }
  next();
};
