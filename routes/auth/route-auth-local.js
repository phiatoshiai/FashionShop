var express = require('express');
var passport = require('passport');
var router = express.Router();
const lodash = require('lodash');
const {
  authCheckLogout,
  authCheckLogin,
} = require('../../app/middlewares/auth-middlewares');

router
  .route('/register')
  .get(function (req, res) {
    let message = req.flash('error')[0];
    if (!lodash.isEmpty(message)) {
      res.json({
        message: message,
      });
    }
    res.render('register')
  })
  .post(
    passport.authenticate('local.register', {
      successRedirect: '/auth/logout',
      failureRedirect: '/auth/register',
      failureFlash: true,
    })
  );

router
  .route('/login')
  .get(authCheckLogin, function (req, res) {
    let message = req.flash('error')[0];
    if (!lodash.isEmpty(message)) {
      res.json({
        message: message,
        code: 401
      });
    }
    res.render('login')
  })
  .post(
    passport.authenticate('local.login', {
      successRedirect: '/sendToken',
      badRequestMessage: 'Xin vui lòng điền email và mật khẩu',
      failureRedirect: '/auth/login',
      failureFlash: true,
    })
  );

router.get('/logout', authCheckLogout, function (req, res) {
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;
