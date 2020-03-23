var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/UserModel');
const flash = require('connect-flash');
const bCrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.local.password);
}

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
 }

//Passport register
passport.use(
  'local.register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passswordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne(
        {
          'local.email': email
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) { 
            console.log('email đã tồn tại');
            return done(null, false, {
              message: 'Email đã được sử dụng, vui lòng chọn email khác'
            });
          }

          var newUser = new User();
          newUser.info.firstname = req.body.firstname;
          newUser.info.lastname = req.body.lastname;
          newUser.local.email = email;
          newUser.local.password = createHash(password);

          newUser.save(function(err, result) {
            if (err) {
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      );
    }
  )
);

/* Passport login */
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({
        'local.email': email
    }, function(err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, {
                message: 'Tài khoản này không tồn tại, vui lòng kiểm tra lại.'
            });
        }

        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }

        return done(null, user);

    });
}));
