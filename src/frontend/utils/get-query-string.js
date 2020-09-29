'use strict';

module.exports = (queryParams) => {
  if (!queryParams) {
    return ``;
  }
  const keys = Object.keys(queryParams);
  if (keys.length === 0) {
    return ``;
  }
  const queries = keys.reduce((acc, key) => {
    return queryParams[key]
      ? acc.concat(`${key}=${queryParams[key]}`)
      : acc;
  }, []);
  return `${queries.join(`&`)}`;
};
