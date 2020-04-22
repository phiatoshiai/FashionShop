const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel');
const lodash = require('lodash');
const bCrypt = require('bcrypt');
const { slugifyString } = require('../../util/slugifyString');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
};

var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidInput = async (req, email, password, done) => {
  const inputUser = await User.findOne({
    email: email
  });
  if (lodash.isEmpty(inputUser)) {
    const data = converDataToResponse(req, email, password);
    return data;
  } else {
    return done(null, false, {
      message: 'Email đã được sử dụng, vui lòng chọn email khác'
    });
  }
};

const converDataToResponse = (req, email, password) => {
  let newUser = new User();

  const { firstName, lastName, gender, address, holderId } = req.body;
  let avatarUrl = null;
  let fullName = `${firstName} ${lastName}`;

  if (lodash.lowerCase(gender) === 'nam') {
    avatarUrl = 'https://www.willowooddental.com/main/img/person2.png';
  } else if (lodash.lowerCase(gender) === 'nu') {
    avatarUrl =
      'https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-female-5-512.png';
  } else {
    avatarUrl =
      'https://cdn4.iconfinder.com/data/icons/lgbt-illustrations/112/37-_couple-lesbian-love-512.png';
  }
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.email = email;
  newUser.password = createHash(password);
  newUser.gender = gender;
  newUser.address = address;
  newUser.avatarUrl = avatarUrl;
  newUser.roles = 'USER';
  (newUser.social = {
    provider: 'local',
    id: null
  }),
    (newUser.slug = slugifyString(fullName));
  newUser.createdBy = holderId || null;
  newUser.updateBy = holderId || null;

  return newUser;
};

//Register
passport.use(
  'local.register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passswordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        let newUser = await isValidInput(req, email, password, done);
        newUser.save(err => {
          if (err) {
            return done(err);
          } else {
            return done(null, newUser);
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* Passport login */
passport.use(
  'local.login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({
          email: email
        });

        if (lodash.isEmpty(user)) {
          return done(null, false, {
            message: 'Tài khoản này không tồn tại, vui lòng kiểm tra lại'
          });
        }

        if (!isValidPassword(user, password)) {
          return done(null, false, {
            message: 'Mật khẩu không đúng, vui lòng kiểm tra lại'
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
