const { isString, isEmpty } = require('lodash');
const slugify = require('@sindresorhus/slugify');

module.exports = {
  slugifyString: (inputString) => {
    let slug = null;
    if (!isEmpty(inputString) && isString(inputString)) {
      slug = slugify(inputString.toLowerCase());
    }
    return slug;
  },
};
