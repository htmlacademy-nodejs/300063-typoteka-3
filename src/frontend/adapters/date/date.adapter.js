'use strict';

const dateFormat = require(`dateformat`);


class DateAdapter {
  get(date) {
    return {
      stamp: dateFormat(date, `yyyy-mm-ddTHH:MM`),
      day: dateFormat(date, `dd.mm.yyyy`),
      time: dateFormat(date, `HH:MM`),
    };
  }
}

module.exports = new DateAdapter();
