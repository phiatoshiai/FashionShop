const router = require('express').Router();
const { authCheck } = require('../app/middlewares/auth-middlewares');
const { deToken } = require('../app/middlewares/detoken-middlewares');
const jwt = require('jsonwebtoken');

router.get('/profile', deToken, (req, res) => {
console.log("req", req.token)
  jwt.verify(req.token, 'do-may-biet', function (err, data) {
  console.log("data", data)
    if (err) {
      res.sendStatus(403);
    } else {
      const payload = data.payload;
      res.render('show-profile', { user: payload.email });
    }
  });
});

module.exports = router;
