var express = require('express');
var passport = require('passport');
var router = express.Router();
const { authCheck, authCheckLogout, authCheckLogin } = require('../../app/middlewares/auth-middlewares');

router
  .route('/register')
  .get(function(req, res) {
    res.render('register');
  })
  .post(
    passport.authenticate('local.register', {
      successRedirect: '/',
      failureRedirect: '/auth/register',
      failureFlash: true
    })
  );

router
  .route('/login')
  .get(authCheckLogin, function(req, res) {
    console.log('AAAAAAAAAAAa');
    
    res.render('login');
  })
  .post(
    passport.authenticate('local.login', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    })
  );

router.get('/logout', authCheckLogout, function(req, res) {
  req.logout()
    req.session = null;
    res.redirect('/');
});

module.exports = router;
