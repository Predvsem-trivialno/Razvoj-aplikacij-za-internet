var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'locationiq',
  apiKey: 'pk.4de90d24c9dcf87e488bb84dcc4da58f',
  format: null
};

const geocoder = NodeGeocoder(options);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');
var postboxRouter = require('./routes/postboxRoutes')
var accesslogRouter = require('./routes/accesslogRoutes');
var tokenRouter = require('./routes/tokenRoutes');

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
});
hbs.registerHelper('dateFormat', function (date, options) {
  const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD. MM. YYYY (HH:mm)"
  return moment(date).format(formatToUse);
});
hbs.registerHelper('dateExpired', function (date, opts){
  if(date < Date.now()){
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
});
hbs.registerHelper('toAddress', function(coords, opts){
  //geocoder.reverse({lat:coords[0], lon:coords[1]}, function(err, res) {
  //  if(!err){
  //      var address = res[0].streetName+" "+res[0].streetNumber+", "+res[0].zipcode+" "+res[0].city+", "+res[0].countryCode;
  //      console.log(address);
  //      return address;
  //  } else {
  //    return "API call failed!";
  //  }
  //});
  return coords[0].toFixed(4) + " " + coords[1].toFixed(4);
});

var session = require('express-session');
const req = require('express/lib/request');
const async = require('hbs/lib/async');
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
app.use('/token', tokenRouter);

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
