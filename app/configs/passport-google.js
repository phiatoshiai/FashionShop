const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../../util/keys');
const UserModel = require('../models/UserModel');

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
      
      UserModel.findOne({ 'social.id': profile.id , 'social.provider': 'google'}).then(
        (currentUser) => {
          if (currentUser) {
            console.log("currentUser", currentUser)
            done(null, currentUser);
          } else {
            console.log('AAAA', profile);
            
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
        }
      );
    }
  )
);
