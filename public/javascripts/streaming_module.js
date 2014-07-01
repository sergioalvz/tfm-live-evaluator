var App = App || {};

App.StreamingModule = (function() {
  var SCORE_THRESHOLD = 0.6;

  var $evaluationContainer = null;

  var startStreaming = function($container) {
    $evaluationContainer = $container;

    io = io.connect();
    io.emit('streaming:start');
    io.on('tweet', processTweet);
  };

  var processTweet = function(evaluation) {
    var score = parseFloat(evaluation.evaluation);

    if(score > SCORE_THRESHOLD) {
      var fields = extractTweetFields(evaluation.tweet);
      var attributes = _({}).extend(fields, { validation: "icon-thumbs-up" });

      var source   = $("#tweet-template").html();
      var template = Handlebars.compile(source);
      var html     = template(attributes);

      $evaluationContainer.append(html);
    }
  };

  var extractTweetFields = function(tweet) {
    var user     = '@' + tweet.user.screen_name;
    var location = tweet.user.location;
    var text     = tweet.text;
    var place    = tweet.place && tweet.place.full_name;

    return {
      user: user,
      location: location,
      text: text
    };
  };

  return {
    startStreaming: startStreaming
  };
})();
