'use strict';

const getQueryParams = (params, paramNames) => {
  const queryParams = JSON.parse(params);
  return paramNames.reduce((acc, param) => {
    if (!queryParams[param]) {
      return acc;
    }
    return {
      ...acc,
      [param]: queryParams[param],
    };
  }, {});
};


module.exports = (paramNames) => (req, res, next) => {
  if (req.query.params) {
    const queryParams = getQueryParams(req.query.params, paramNames);
    req.locals = {
      ...req.locals,
      ...queryParams,
    };
  }
  next();
};
