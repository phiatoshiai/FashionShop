var express = require('express');
var passport = require('passport');
var router = express.Router();

router
  .route('/dang-ky')
  .get(function(req, res) {
    res.render('register');
  })
  .post(
    passport.authenticate('local.register', {
      successRedirect: '/',
      failureRedirect: '/nguoi-dung/dang-ky',
      failureFlash: true
    })
  );

router
  .route('/dang-nhap')
  .get(function(req, res) {
    res.render('login');
  })
  .post(
    passport.authenticate('local.login', {
      successRedirect: '/',
      failureRedirect: '/nguoi-dung/dang-nhap',
      failureFlash: true
    })
  );

module.exports = router;
