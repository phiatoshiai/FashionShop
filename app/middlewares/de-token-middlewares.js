const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');
const keys = require('../../util/keys');

module.exports.checkToken = function (req, res, next) {
  const accessToken = req.headers.accesstoken;

  if (!isEmpty(accessToken)) {
    jwt.verify(accessToken, keys.JWT.KEY, function (err, data) {
      if (!isEmpty(data)) {
        req.dataUser = data;
        next();
      }

      if (err) {
        const message = err.message;
        res.json({ message: message, code: 403 });
      }
    });
  } else {
    res.json({
      message: 'Bạn không có quyền truy cập vào trang này',
      code: 401,
    });
  }
};
