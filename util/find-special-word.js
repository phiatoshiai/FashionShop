const { isString, isEmpty, find, filter } = require('lodash');

module.exports = {
  findSpecialWord: (inputString, action) => {
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
};
