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
  res.redirect("http://localhost:3000/saveToken?token=" + accessToken);
});

module.exports = router;
