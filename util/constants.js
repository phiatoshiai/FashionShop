module.exports = {
  REGEX_PRODUCT_CODE: /^[A-Z0-9_-]{3,20}$/,
  TIMEZONE_DEFAULT: 'Asia/Ho_Chi_Minh',
  SKIP_DEFAULT: 0,
  LIMIT_DEFAULT: 25,
  LIMIT_TOP_DEFAULT: 10,
  TIME: {
    TODAY: '1',
    YESTERDAY: '2',
    SEVEN_DAYS_AGO: '3',
    FOURTEEN_DAYS_AGO: '4',
    THIRTY_DAYS_AGO: '5',
    THIS_MONTH: '6',
    LAST_MONTH: '7',
    THIS_WEEK: '8',
    OPTION: '9',
    TREE_MONTHS_AGO: '10',
    THIS_QUARTER: '11',
    THIS_YEAR: '12',
  },
  TYPE: {
    IMPORT_EXPORT: {
      IMPORT: '2c5a6627-2451-4ae6-86fa-05f9c567a6b3',
      EXPORT: '3c9472a8-cd85-46fa-8036-64ec4b0b1405',
    },
    BEST_TOP_CONFIG: {
      CATEGORY: 'cb7d9544-41b3-4888-803d-ff88894b905a',
      ALL: '1760dc79-fcbd-46ea-954e-f9b7c7a05da1',
    },
  },
};
