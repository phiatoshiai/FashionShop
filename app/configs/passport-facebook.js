const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
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
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/callback',
      clientID: '2970685959618529',
      clientSecret: '7cef0cfd94a0908baae51aa783adea45',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'picture.type(large)']
    },
    async (accessToken, refreshToken, profile, done) => {
    const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`  
      UserModel.findOne({ 'social.id': profile.id , 'social.provider': 'facebook'}).then(
        (currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            new UserModel({
              firstName: profile.name.familyName,
              lastName: profile.name.givenName,
              avatarUrl: picture,
              email: profile.emails[0].value,
              password: null,
              roles: 'USER',
              social: {
                provider: 'facebook',
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
