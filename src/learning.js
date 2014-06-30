var shell = require('shelljs');
var config = require('../config/configuration.json');

var clearTweet = function(tweet) {
  var tokenizer = /([a-zA-Z_ñáéíóú][a-zA-Z_ñáéíóú']*[a-zA-Z_ñáéíóú]|[a-zA-Z_ñáéíóú])/g;
  var validTerm = /^(@|#)?[a-záéíóú]+$/g;

  var tokens = tweet.match(tokenizer);
  var matches = tokens.filter(function(t) { return validTerm.test(t); });
  return matches.join(" ");
};

var formatInput = function(tweet) {
  var clean = clearTweet(tweet);
  return '1 |Tweet ' + clean;
};

var evaluate = function(tweet, req) {
  var text = tweet.text;
  shell.exec('echo "' + formatInput(text.toLowerCase()) + '" | nc ' + config.vw_host + ' ' + config.vw_port, { silent:true }, function(code, output){
    output = parseFloat(output);
    req.io.emit('take_tweet', {
      evaluation: output,
      tweet: tweet
    });
  });
};

exports.evaluate = evaluate;
