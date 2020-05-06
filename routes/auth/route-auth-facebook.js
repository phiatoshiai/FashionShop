const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
    successRedirect: '/show/profile',
    failureRedirect: '/auth/login',
  })
);


module.exports = router;
