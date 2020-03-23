'use strict';
const ControllerUpload = require('../app/controllers/ControllerUpload');
const uploadMulter = require('../app/models/ModelMulter');
const auth = require('../app/middlewares/auth-google-middlewares');

module.exports = function(app) {
    app.get('/', auth.authCheck, (req, res) => {
        console.log(req.user); 
        res.send(`hi ${req.user.local.email}`)
    });

    app.get('/login', (req, res) => {
        res.render('login')
    });


    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login')
    });
};
