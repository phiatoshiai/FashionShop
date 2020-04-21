module.exports.authCheck = function(req, res, next) {
  if (req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

module.exports.authCheckLogout = function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};
