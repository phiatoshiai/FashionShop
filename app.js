const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');
const keys = require('./util/keys');
const {
  checkToken,
  isAdmin,
} = require('./app/middlewares/de-token-middlewares');

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost:27017/sell');
mongoose.connection.on('error', function (err) {
  console.log('Lỗi kết nối đến CSDL: ' + err);
});

// app.use(logger('combined'));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.SESSION.cookieKey],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/home-routes')(app); //routes homepage
require('./routes/upload-image-routes')(app); //routes upload image
require('./app/configs/passport-google');
require('./app/configs/passport-facebook');
require('./routes/token-routes')(app);

const localLogin = require('./routes/auth-local-routes'); //local login
const googleLogin = require('./routes/auth-google-routes'); //google login
const facebookLogin = require('./routes/auth-facebook-routes'); //facebook login
const profile = require('./routes/profile-routes');
const product = require('./routes/product-routes');
const category = require('./routes/category-routes');
const wareHouse = require('./routes/warehouse-routes');
const importExport = require('./routes/import-export-routes');
const bestTopConfig = require('./routes/best-top-config-routes');

app.use('/auth', localLogin);
app.use('/auth', googleLogin);
app.use('/auth', facebookLogin);
app.use('/show', profile);
app.use('/product', checkToken, isAdmin, product);
app.use('/category', checkToken, isAdmin, category);
app.use('/wareHouse', checkToken, isAdmin, wareHouse);
app.use('/importExport', checkToken, isAdmin, importExport);
app.use('/bestTopConfig', checkToken, isAdmin, bestTopConfig);


app.listen(port, () => console.log('%c port', 'color: #f2ceb6', port));
