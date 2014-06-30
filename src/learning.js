var shell = require('shelljs');
var config = require('../config/configuration.json');

var clearTweet = function(tweet) {
  //Remove punctuation
  return tweet.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
};

var formatInput = function(tweet) {
  var clean = clearTweet(tweet);
  return '|Tweet ' + clean;
};

var evaluate = function(tweet) {
  var result = shell.exec('echo "' + formatInput(tweet) + '" | nc ' + config.vw_host + ' ' + config.vw_port);
  return result;
};

exports.evaluate = evaluate;
