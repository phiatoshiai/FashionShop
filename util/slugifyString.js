const lodash = require('lodash');
const slugify = require('@sindresorhus/slugify');

module.exports = {
  slugifyString: inputString => {
    let slug = null;
    if (!lodash.isEmpty(inputString) && lodash.isString(inputString)) {
      slug = slugify(inputString.toLowerCase());
    }
    return slug;
  }
};
