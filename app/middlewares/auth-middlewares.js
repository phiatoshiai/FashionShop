module.exports.authCheck = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports.authCheckLogin = function(req, res, next) {
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
