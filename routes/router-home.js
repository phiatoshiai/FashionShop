'use strict';

const lodash = require('lodash');

module.exports = function (app) {
  app.get('/', (req, res) => {
    const user = lodash.get(req, 'user');
    if (user) {
      res.render('homepage', { user: req.user.email });
    } else {
      res.render('homepage');
    }
  });
};
