var expressio    = require('express.io');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var twit         = require('twit');

var learning     = require('./src/learning');
var routes       = require('./routes/index');

var config       = require('./config/configuration.json');
var credentials  = require('./config/twitter.json');

var app = expressio();
app.http().io();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(expressio.static(path.join(__dirname, 'public')));

app.use('/', routes);

//  =============================================================
// |                         REAL TIME                           |
//  =============================================================
var twitter = new twit({
  consumer_key: credentials.consumer_key,
  consumer_secret: credentials.consumer_secret,
  access_token: credentials.access_token,
  access_token_secret: credentials.access_token_secret
});

var stream = twitter.stream('statuses/filter', config.streaming_options);

app.io.route('streaming', {
  start: function(req) {
    stream.on('tweet', function(tweet) {
      var evaluation = learning.evaluate(tweet, req);
    });
  }
});
//  =============================================================

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.listen(7076);
