const configConventional = require('@commitlint/config-conventional');

const typeEnum = configConventional.rules['type-enum'];
typeEnum[2].push('init');

module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'type-enum': typeEnum,
  }
};
