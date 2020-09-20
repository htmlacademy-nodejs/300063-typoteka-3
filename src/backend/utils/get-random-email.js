'use strict';

const getRandomInt = require(`./get-random-int`);
const getRandomString = require(`./get-random-string`);

const MIN_COUNT_OF_DOMAIN_PART_SPECIAL_SYMBOLS = 2;
const MIN_COUNT_OF_SECOND_PART_SYMBOLS = 1;
const MAX_COUNT_OF_LOCAL_PART_SYMBOLS = 64;
const MAX_COUNT_OF_EMAIL_SYMBOLS = 256;
const MIN_COUNT_OF_EMAIL_SYMBOLS = 5;
const AVAILABLE_EMAIL_SYMBOLS = `0123456789abcdefghijklmnopqrstuvwxyz`;


const checkEmailLength = (length) => {
  if (length < MIN_COUNT_OF_EMAIL_SYMBOLS) {
    console.error(`Email не может содержать менее 5 символов`);
    return false;
  }
  if (length > MAX_COUNT_OF_EMAIL_SYMBOLS) {
    console.error(`Email не может содержать более 256 символов`);
    return false;
  }
  return true;
};

const getRandomDomain = (domains) => {
  if (typeof domains === `string`) {
    return domains;
  }
  if (!(domains instanceof Array)) {
    console.error(`Некорректный тип параметра "domains"`);
  }
  const domainZoneCount = domains.length;
  if (domainZoneCount === 0) {
    console.error(`"domains" должен содержать хотябы 1 домен`);
  }
  const domainIndex = getRandomInt(0, domainZoneCount - 1);
  return domains[domainIndex];
};

const getRandomEmail = (length, domains) => {
  if (!checkEmailLength(length)) {
    return ``;
  }
  const randomDomain = getRandomDomain(domains);
  let localPartLength = MAX_COUNT_OF_LOCAL_PART_SYMBOLS;
  let domainPartLength = MIN_COUNT_OF_DOMAIN_PART_SPECIAL_SYMBOLS + MIN_COUNT_OF_SECOND_PART_SYMBOLS;
  const symbolCountOfEmailWithMaxLocalPartLength = MAX_COUNT_OF_LOCAL_PART_SYMBOLS + domainPartLength;
  if (length >= symbolCountOfEmailWithMaxLocalPartLength) {
    domainPartLength = length - localPartLength - MIN_COUNT_OF_DOMAIN_PART_SPECIAL_SYMBOLS - randomDomain.length;
  } else {
    localPartLength = length - domainPartLength;
  }
  const localPartEmail = getRandomString(AVAILABLE_EMAIL_SYMBOLS, localPartLength);
  const domainPartEmail = getRandomString(AVAILABLE_EMAIL_SYMBOLS, domainPartLength);
  return `${localPartEmail}@${domainPartEmail}.${randomDomain}`;
};

module.exports = getRandomEmail;

