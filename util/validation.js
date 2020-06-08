const { isString, isEmpty, find, filter, isNumber } = require('lodash');

module.exports = {
  isSpecialWord: (inputString, action) => {
    let special = '~!@#$%^&*+=|{}":;<>,.?';

    if (action === 'code') {
      special = special.concat("'()/[]");
    }
    special = special.concat("'");

    if (!isEmpty(inputString) && isString(inputString)) {
      const specialFind = filter(inputString, (input) => {
        return find(special, (spec) => spec === input);
      });

      if (!isEmpty(specialFind)) {
        return false;
      }
    }
    return true;
  },

  isNumberField: (input) => {
    if (!isNumber(input) || input < 0) {
      return -1;
    }
    return 1;
  },
};
