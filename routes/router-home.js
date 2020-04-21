'use strict';
module.exports = function(app) {
    app.get('/home', (req, res) => {
        res.render('homepage');
    });
};
