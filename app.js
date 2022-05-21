var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');
var postboxRouter = require('./routes/postboxRoutes')
var accesslogRouter = require('./routes/accesslogRoutes');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://root:root@cluster0.u3afm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//var mongoDB = 'mongodb://127.0.0.1/projekt';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
var moment = require('moment');

hbs.registerHelper('if_equal', function(a, b, opts) {
  if (a == b) {
      return opts.fn(this)
  } else {
      return opts.inverse(this)
  }
})
hbs.registerHelper('dateFormat', function (date, options) {
  const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD. MM. YYYY (HH:mm)"
  return moment(date).format(formatToUse);
});

var session = require('express-session');
const req = require('express/lib/request');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/postbox', postboxRouter);
app.use('/accesslog', accesslogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
