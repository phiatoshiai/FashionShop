const router = require('express').Router();
const auth = require('../app/middlewares/auth-google-middlewares');

router.get('/', auth.authCheck, (req, res) => {
    res.send(`Hello ${req.user.local.email}`)
})

module.exports = router;