'use strict';

const lodash = require('lodash');

module.exports = function (app) {
  app.get('/sendToken', (req, res) => {
    const accessToken = lodash.get(req, 'user.token');
    return res.json({
      accessToken: accessToken,
    });
  });
};
