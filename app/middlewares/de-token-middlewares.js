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
        return res.status(500).send({ msg: message });
      }
    });
  } else {
    return res.status(500).send({ msg: 'Hết hạn phiên làm việc' });
  }
};

module.exports.isAdmin = function (req, res, next) {
  const roles = req.dataUser.payload.roles || [];
  if (roles.includes('ADMIN')) {
    return next();
  } else {
    return res
      .status(500)
      .send({ msg: 'Bạn không có quyền truy cập vào trang này' });
  }
};

module.exports.isFreelanecer = function (req, res, next) {
  const roles = req.dataUser.roles || [];
  if (roles.includes('FREELANECER')) {
    return next();
  } else {
    return res
      .status(500)
      .send({ msg: 'Bạn không có quyền truy cập vào trang này' });
  }
};
