const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../../util/keys');
const UserModel = require('../models/UserModel');

passport.serializeUser(function (user, done) {
  console.log('IIIIIII', user)
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('OOOOOOOO', user)
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
      UserModel.findOne({ 'social.id': profile.id }).then(
        (currentUser) => {
          if (currentUser) {
            console.log('is user BBBBBBBBBBBBBBBBBBB', profile);
            done(null, currentUser);
          } else {
            new UserModel({
              firstname: profile.name.familyName,
              lastname: profile.name.givenName,
              avatarUrl: profile.photos[0].value,
              email: profile.emails[0].value,
              password: null,
              roles: 'USER',
              social: {
                provider: 'google',
                googleId: profile.id,
              },
            })
              .save()
              .then((newUser) => {
                console.log('new user CCCCCCCCCCCCCCCCCC' + newUser);
                done(null, newUser);
              });
          }
        }
      );
    }
  )
);
