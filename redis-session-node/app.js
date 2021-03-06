/**
 Loading all dependencies.
 **/
var express = require("express");
var redis = require("redis");
var mysql = require("mysql");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require("path");
var async = require("async");
var favicon = require('serve-favicon');
var logger = require('morgan');
var routes = require('./routes/index');
var config = require('config');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// IMPORTANT
// Here we tell Express to use Redis as session store.
// We pass Redis credentials and port information.
// And express does the rest !
var sessionConfig = config.get('SessionCache.redisStore');

var client = redis.createClient(sessionConfig.port, sessionConfig.host,  {no_ready_check: true});

//var client = redis.createClient(6379, '127.0.0.1');

app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({client: client}),
    saveUninitialized: false,
    resave: false
}));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser("secretSign#143_!223"));
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/', routes);
app.use('/home', routes);
app.use('/login', routes);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
