var shell  = require('shelljs');
var config = require('../config/configuration.json');

var SCORE_TRESHOLD = 0.7;

var clear = function(text) {
  var clean = "";

  var tokenizer = /([a-zA-Z_ñáéíóú][a-zA-Z_ñáéíóú']*[a-zA-Z_ñáéíóú]|[a-zA-Z_ñáéíóú])/g;
  var validTerm = /^(@|#)?[a-záéíóú]+$/g;

  var tokens = text.match(tokenizer);
  if(tokens) {
    var matches = tokens.filter(function(t) { return validTerm.test(t); });
    clean = matches.join(" ");
  }

  return clean;
};

var formatInput = function(user, location, text) {
  user     =  '@' + user.toLowerCase();
  location = clear(location.toLowerCase());
  text     = clear(text.toLowerCase());

  return '|Tweet ' + user + ' ' + location + ' ' + text;
};

var isCorrectlyMarked = function(tweet) {
  if(!tweet.geo) return false;

  var lat = tweet.geo.coordinates[0];
  var lng = tweet.geo.coordinates[1];

  var isOk = false;

  config.local.boundingBoxes.forEach(function(bb) {
    if(bb.sw.lat <= lat && bb.ne.lat >= lat && bb.sw.lng <= lng && bb.ne.lng >= lng) isOk =  true;
  });

  return isOk;
};

var evaluate = function(tweet, req) {
  var user     = tweet.user.screen_name;
  var location = tweet.user.location;
  var text     = tweet.text;

  var command = 'echo "' + formatInput(user, location, text) + '" | nc ' + config.vw_host + ' ' + config.vw_port;

  shell.exec(command, { silent: true }, function(code, output){
    if(code === 0) {
      var score = parseFloat(output);
      if(score > SCORE_TRESHOLD) {
        req.io.emit('tweet', {
          isOk: isCorrectlyMarked(tweet),
          tweet: tweet
        });
      }
    }
  });
};

exports.evaluate = evaluate;
