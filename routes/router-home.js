'use strict';
module.exports = function (app) {
  app.get('/', (req, res) => {
    if (req.user) {
      res.render('homepage', { user: req.user.email });
    } else {
        res.render('homepage');
    }
  });
};
