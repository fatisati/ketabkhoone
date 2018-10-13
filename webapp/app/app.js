var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
// var busboy = require('connect-busboy');
var multer = require('multer');
var session = require('express-session');

// New Code
//var db_url = 'mongodb://maryam:m123456@ds119273.mlab.com:19273/ketabkhooneh' //process.env.MONGODB_URI //process.env.MONGODB_URI //'localhost:27017/nodetest1'
//var monk = require('monk');
var mongoose = require("mongoose");
mongoose.plugin(require('mongoose-regex-search'));
//var db = monk(db_url);
const db = mongoose.connect('mongodb://maryam:m123456@ds119273.mlab.com:19273/ketabkhooneh');
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
app.use(session({secret: 'ssshhhhh'}));

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