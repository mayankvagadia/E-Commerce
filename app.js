global.config = require('./config/config.js');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const session = require('express-session'); //Create a session middleware
//The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
const flash = require('connect-flash');
const cookieSession = require('cookie-session'); //Cookie-based session middleware.
const compression = require('compression');
process.env['TIMESTAMP'] = Math.round(new Date().getTime() / 1000);
require('./models');
require("./common/functions");
var cors = require('cors');


global.isLoggedIn = function (req, res, next) {
  /**
   * if user is authenticated in the session, then check otp is verified or not
   * If verified then make user log in
   */
  if (req.isAuthenticated()) {
    return next(); //return next
  }
  // if they aren't redirect them to the home page
  res.redirect('/admin/?u=' + req.originalUrl);
};

var app = express();

app.use(cors());

app.use(compression());

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg
      /*,
              value : value*/
    };
  }
}));




/****************************body parser */
app.use(bodyParser.json({
  limit: '50mb',
  parameterLimit: 1000000
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false,
  parameterLimit: 1000000
}));

/********************************************** */
app.use(cookieSession(config.cookie));
//express session
app.use(session(config.session));
//use connect flash
app.use(flash());
app.use(cookieParser());
eval(fs.readFileSync('./helpers/auth.js') + '');

/********************************************** */
app.use(express.static(path.join(__dirname, 'public')));
const hbs = exphbs.create(require('./helpers/handlebar.js'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

function setEnvironment(req, res, next) {
  res.locals.use_minified = process.env['APP_ENV'] == "production";
  res.locals.app_timestamp = process.env['TIMESTAMP'];
  res.locals.sort_url = unescape(req.url);
  if (req.xhr) {
    res.locals.layout = 'ajax';
  }
  /**
   * Set locals variables
   */
  res.locals.site_title = config.site_title;
  config.base_url = req.protocol + '://' + req.get('host') + '/'; //set base url
  // Store user sessions
  res.locals.user_session = req.user;
  // Set flash messages in locals
  let error = req.flash('error');
  let success = req.flash('success');
  if (success.length > 0) {
    res.locals.flash = {
      type: 'success',
      message: success
    };
  }
  if (error.length > 0) {
    res.locals.flash = {
      type: 'error',
      message: error
    };
  }
  return next();
};

app.use(setEnvironment);


/******************validate user for api calling */

app.use(function (req, res, next) {
  if (req.method == "POST") {
    if (req.path.indexOf("/api/") !== -1) {
      isValidApiUser(req, res, function () {
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
});


/****************************routers */
app.use('/admin', require('./routes/index'));

// Rest of routes of admin only accessible if user is logged-in
app.use(isLoggedIn);
app.use('/admin/users', require('./routes/users'));
app.use('/main', require('./routes/main'));

app.use('/', function (req, res, next) {
  res.redirect("/admin");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;