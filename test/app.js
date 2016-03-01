var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');


var app = express();

//session
app.use(session({
  secret:'secret',
  cookie:{
    maxAge:1000*60*30
  }
}));
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if(err){
    res.locals.message = err;
  }
  next();
});
//全局
global.dbHandel = require('./db/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/login");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//multer
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/user')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });
var cpUpload = upload.any();
app.use(cpUpload);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen("3000");

module.exports = app;
