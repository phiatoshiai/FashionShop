const router = require('express').Router();
const { authCheck } = require('../app/middlewares/auth-middlewares');

router.get('/profile', authCheck, (req, res) => {
  res.render('show-profile', { user: req.user.email });
});

module.exports = router;
