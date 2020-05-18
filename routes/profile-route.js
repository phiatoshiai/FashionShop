const router = require('express').Router();
const { checkToken } = require('../app/middlewares/de-token-middlewares');
const { isEmpty } = require('lodash');

router.get('/profile', checkToken, (req, res) => {
  const dataUser = req.dataUser;
  if(!isEmpty(dataUser)) { 
    res.json(dataUser)
  }
});

module.exports = router;
