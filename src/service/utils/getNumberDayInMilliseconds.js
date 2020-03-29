'use strict';

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * 60;
const MINUTES_IN_HOUR = SECONDS_IN_MINUTE * 60;
const HOURS_IN_DAY = MINUTES_IN_HOUR * 24;

const getNumbersDayInMilliseconds = (count) => count * HOURS_IN_DAY;

module.exports = {
  getNumbersDayInMilliseconds,
};
