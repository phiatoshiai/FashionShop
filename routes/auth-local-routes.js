var express = require('express');
var passport = require('passport');
var router = express.Router();
const lodash = require('lodash');
const UserModel = require('../app/models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../util/keys');
const { authCheckLogout } = require('../app/middlewares/auth-middlewares');

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
  UserModel.findOne({ email })
    .then((currentUser) => {
      if (!currentUser)
        res.status(400).send({ msg: 'Tên đăng nhập không tồn tại' });
      else {
        if (bcrypt.compareSync(password, currentUser.password)) {
          const payload = {
            email: currentUser.email,
            userName: `${currentUser.lastName} ${currentUser.firstName}`,
            avatarUrl: currentUser.avatarUrl,
            roles: currentUser.roles,
          };
          const accessToken = jwt.sign({ payload }, keys.JWT.KEY, {
            expiresIn: 60 * 60,
          });
          res.status(200).send({ accessToken });
        } else {
          res.status(401).send({ msg: 'Mật khẩu không đúng' });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({msg: err.message});
    });
});

router.get('/logout', authCheckLogout, function (req, res) {
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;
