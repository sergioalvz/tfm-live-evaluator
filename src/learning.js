var shell  = require('shelljs');
var config = require('../config/configuration.json');

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

var evaluate = function(tweet, req) {
  var user     = tweet.user.screen_name;
  var location = tweet.user.location;
  var text     = tweet.text;

  var command = 'echo "' + formatInput(user, location, text) + '" | nc ' + config.vw_host + ' ' + config.vw_port;

  shell.exec(command, { silent: true }, function(code, output){
    req.io.emit('tweet', { evaluation: output, tweet: tweet });
  });
};

exports.evaluate = evaluate;
