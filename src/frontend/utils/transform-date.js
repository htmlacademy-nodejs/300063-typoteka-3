'use strict';

const dateFormat = require(`dateformat`);


module.exports = (date) => {
  const [day, month, year] = date.split(`.`);
  const currentDate = new Date().setFullYear(year, month - 1, day);
  return dateFormat(currentDate, `yyyy-mm-dd HH:MM:ss`);
};
