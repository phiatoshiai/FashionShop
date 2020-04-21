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
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
    console.log("profile", profile)
        // UserModel.findOne({ 'local.facebookId': profile.id }).then(currentUser => {
        //   if (currentUser) {
        //     console.log('is user', profile);
        //     done(null, currentUser)
        //   } else {
        //     new UserModel({
        //       info: {
        //         firstname: profile.name.familyName || null,
        //         lastname: profile.name.givenName || null,
        //         imageUrl: profile.photos[0].value || null
        //       },
        //       local: {
        //         facebookId: profile.id,
        //         email: profile.emails[0].value || null,
        //         password: '110859236255629276836'
        //       }
        //     })
        //       .save()
        //       .then(newUser => {
        //         console.log('new user' + newUser);
        //         done(null, newUser)

        //       });
        //   }
        // });
    }
  )
);
