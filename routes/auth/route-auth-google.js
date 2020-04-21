const router = require('express').Router();
const passport = require('passport');
const { authCheck, authCheckLogout } = require('../../app/middlewares/auth-middlewares');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
   res.redirect('/profile')
    
})

router.get('/logout', authCheckLogout, function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router;