const router = require('express').Router();
const passport = require('passport');
const { get } = require('lodash');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  const accessToken = get(req, 'user.token');
  res.json({
    accessToken: accessToken,
  });
});

module.exports = router;
