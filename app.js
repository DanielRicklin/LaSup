const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const color = require('colors');
const dotenv = require('dotenv');
const router = require('./routes');

// DATABASE
const connectDB = require('./config/db.js');
const Log = require('./models/logModel');

dotenv.config()
connectDB()

//ROUTES
// var indexRoute = require('./routes/index');
// var usersRoute = require('./routes/users');
// var equipmentRoute = require('./routes/equipment');

const app = express();
exports.app = app;

app.use(function(req, res, next) {
  const { rawHeaders, httpVersion, method, url } = req;

  new Log({
    rawHeaders,
    httpVersion,
    method,
    url
  }).save(next())

  // next(console.log(
  //   JSON.stringify({
  //     rawHeaders,
  //     httpVersion,
  //     method,
  //     remoteAddress,
  //     remoteFamily,
  //     url
  //   })
  // ))
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require('./config/jwt.config');
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

// app.use('/', indexRoute);
// app.use('/users', usersRoute);
// app.use('/equipment', equipmentRoute);

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
