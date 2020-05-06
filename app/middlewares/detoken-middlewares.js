const lodash = require('lodash');

module.exports.deToken = function(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.sendStatus(403);
    }
    
}