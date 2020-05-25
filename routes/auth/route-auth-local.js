var express = require('express');
var passport = require('passport');
var router = express.Router();
const lodash = require('lodash');
const UserModel = require('../../app/models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  authCheckLogout,
  authCheckLogin,
} = require('../../app/middlewares/auth-middlewares');

router
  .route('/register')
  .get(function (req, res) {
    let message = req.flash('error')[0];
    if (!lodash.isEmpty(message)) {
      res.json({
        message: message,
      });
    }
    res.render('register');
  })
  .post(
    passport.authenticate('local.register', {
      successRedirect: '/auth/logout',
      failureRedirect: '/auth/register',
      failureFlash: true,
    })
  );

router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }, 'username password email')
    .then((user) => {
      if (!user) res.status(400).send({ msg: 'Tên đăng nhập không tồn tại' });
      else {
        if (bcrypt.compareSync(password, user.password)) {
          const accessToken = jwt.sign(
            { email },
            "#$%&&*MySecretKey123@#$%&&*",
            { expiresIn: 60*60 }
          );
          res.status(200).send({ accessToken });
        } else {
          res.status(401).send({ msg: 'Mật khẩu không đúng' });
        }
      }
    })
    .catch((err) => {
      console.log('ERR', err);
      res.status(500).send(err);
    });
});

router.get('/logout', authCheckLogout, function (req, res) {
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;
