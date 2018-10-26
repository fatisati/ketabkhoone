var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
// var busboy = require('connect-busboy');
var multer = require('multer');
var session = require('client-sessions');
var cookieParser = require('cookie-parser');

// New Code
//var db_url = 'mongodb://maryam:m123456@ds119273.mlab.com:19273/ketabkhooneh' //process.env.MONGODB_URI //process.env.MONGODB_URI //'localhost:27017/nodetest1'
//var monk = require('monk');
var mongoose = require("mongoose");
mongoose.plugin(require('mongoose-regex-search'));
//var db = monk(db_url);
const db = mongoose.connect('mongodb://maryam:m123456@ds119273.mlab.com:19273/ketabkhooneh',{ useNewUrlParser: true });
// const db = mongoose.connect(process.env.MONGODB_URI);
if(!db){
  console.log('no connection to db')
}
console.log('started');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(busboy()); 
app.use(multer({dest:__dirname+'/file/uploads/'}).any());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(cookieParser());

var indexRouter = require('./routes/index');
app.use('/', indexRouter);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    // var cookie = req.cookies.cookieName;
    // if (cookie === undefined)
    // {
    //   // no: set a new cookie
    //   var islogin = false;
    //   res.cookie('cookieName',islogin, { maxAge: 900000, httpOnly: true });
    //   console.log('cookie created successfully');
    // } 
    // else
    // {
    //   // yes, cookie was already present 
    //   console.log('cookie exists', cookie);
    // } 
    next();
});


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