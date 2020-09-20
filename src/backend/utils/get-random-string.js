'use strict';

const getRandomInt = require(`./get-random-int`);


module.exports = (availableSymbols, length) => {
  return new Array(length)
    .fill(``)
    .map(() => {
      const randomSymbolIndex = getRandomInt(0, availableSymbols.length - 1);
      return availableSymbols[randomSymbolIndex];
    })
    .join(``);
};

