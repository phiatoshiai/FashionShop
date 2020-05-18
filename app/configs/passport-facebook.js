const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../../util/keys');
const UserModel = require('../models/UserModel');
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
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/callback',
      clientID: '2970685959618529',
      clientSecret: '7cef0cfd94a0908baae51aa783adea45',
      profileFields: [
        'id',
        'email',
        'gender',
        'link',
        'locale',
        'name',
        'picture.type(large)',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      const picture = `http://graph.facebook.com/${profile.id}/picture?type=square`;
      UserModel.findOne({
        'social.id': profile.id,
        'social.provider': 'facebook',
      }).then((currentUser) => {
        if (currentUser) {
          currentUser.firstName = profile.name.familyName;
          currentUser.lastName = profile.name.lastName;
          currentUser.avatarUrl = picture;
          currentUser.email = profile.emails[0].value;
          currentUser.social.id = profile.id;
          const payload = {
            email: currentUser.email,
            userName: `${currentUser.lastName} ${currentUser.firstName}`,
            avatarUrl: currentUser.avatarUrl,
          };
          const token = jwt.sign({ payload }, keys.JWT.KEY);
          currentUser.token = token;
          currentUser.save((err) => {
            if (err) {
              done(null, false);
            } else {
              done(null, currentUser);
            }
          });
        } else {
          let user = {
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
          };

          new UserModel(user).save().then((newUser) => {
            done(null, newUser);
          });
        }
      });
    }
  )
);
