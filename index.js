'use strict';

const ToWords = require('./lib/to-words');
const toWords = new ToWords();

module.exports = (number, options = {}) => {
  return toWords.convert(number, options);
};
