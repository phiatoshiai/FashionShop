const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../../util/keys');
const UserModel = require('../models/UserModel');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: keys.GOOGLE.CLIENTID,
      clientSecret: keys.GOOGLE.CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      UserModel.findOne({ 'local.googleId': profile.id }).then(currentUser => {
        if (currentUser) {
          console.log('is user', profile);
          done(null, currentUser)
        } else {
          new UserModel({
            info: {
              firstname: profile.name.familyName,
              lastname: profile.name.givenName,
              imageUrl: profile.photos[0].value
            },
            local: {
              googleId: profile.id,
              email: profile.emails[0].value,
              password: '110859236255629276836'
            }
          })
            .save()
            .then(newUser => {
              console.log('new user' + newUser);
              done(null, newUser)
              
            });
        }
      });
    }
  )
);
