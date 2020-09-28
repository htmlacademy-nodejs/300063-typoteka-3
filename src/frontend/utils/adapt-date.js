'use strict';

const dateFormat = require(`dateformat`);


module.exports = (date) => ({
  stamp: dateFormat(date, `yyyy-mm-ddTHH:MM`),
  day: dateFormat(date, `dd.mm.yyyy`),
  time: dateFormat(date, `HH:MM`),
});
