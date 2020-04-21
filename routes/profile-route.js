const router = require('express').Router();
const { authCheck } = require('../app/middlewares/auth-middlewares');

router.get('/', (req, res) => {
  res.send(`Hello ${req.user.email}`);
});

module.exports = router;
