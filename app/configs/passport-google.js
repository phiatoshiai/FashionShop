const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../../util/keys');
const UserModel = require('../models/user-model');
const jwt = require('jsonwebtoken');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: keys.GOOGLE.CLIENTID,
      clientSecret: keys.GOOGLE.CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      UserModel.findOne({
        'social.id': profile.id,
        'social.provider': 'google',
      }).then((currentUser) => {
        if (currentUser) {
          currentUser.firstName = profile.name.familyName;
          currentUser.lastName = profile.name.givenName;
          currentUser.avatarUrl = profile.photos[0].value;
          currentUser.email = profile.emails[0].value;
          currentUser.social.id = profile.id;
          const payload = {
            email: currentUser.email,
            userName: `${currentUser.lastName} ${currentUser.firstName}`,
            avatarUrl: currentUser.avatarUrl,
            roles: currentUser.roles,
          };
          const token = jwt.sign({ payload }, keys.JWT.KEY, {
            expiresIn: 60 * 60,
          });
          currentUser.token = token;
          currentUser.save((err) => {
            if (err) {
              done(null, false);
            } else {
              done(null, currentUser);
            }
          });
        } else {
          new UserModel({
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            avatarUrl: profile.photos[0].value,
            email: profile.emails[0].value,
            password: null,
            roles: 'USER',
            social: {
              provider: 'google',
              id: profile.id,
            },
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
