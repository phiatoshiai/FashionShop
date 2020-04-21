const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const session = require('express-session');
const cookieSession =  require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');
require('./app/configs/passport-local');
const keys = require('./util/keys');

const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('%c port', 'color: #f2ceb6', port));
mongoose.connect('mongodb://localhost:27017/sell');
mongoose.connection.on('error', function(err) {
  console.log('Lỗi kết nối đến CSDL: ' + err);
});

app.use(logger('combined'));

app.engine('ejs', require('ejs-locals'));
app.set('views', './app/views'); //khai báo thư mục chứa giao diện là folder views
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.SESSION.cookieKey]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./routes/router-home')(app); //routes homepage
require('./routes/web-admin-upload-image')(app); //routes upload image
require('./app/configs/passport-google');
require('./app/configs/passport-facebook');

const localLogin = require('./routes/auth/route-auth-local'); //local login
const googleLogin = require('./routes/auth/route-auth-google'); //google login
const facebookLogin = require('./routes/auth/route-auth-facebook'); //facebook login
const profileGoogle = require('./routes/profile-route');

app.use('/auth', localLogin);
app.use('/auth', googleLogin);
app.use('/auth', facebookLogin);
app.use('/show', profileGoogle);
