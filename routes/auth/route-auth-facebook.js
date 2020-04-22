const router = require('express').Router();
const passport = require('passport');

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile'],
    prompt : "select_account"
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = router;
