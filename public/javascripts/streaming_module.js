var StreamingModule = (function() {
  var $evaluationContainer = null;

  var startStreaming = function($container) {
    $evaluationContainer = $container;

    io = io.connect();
    io.emit('streaming:start');
    io.on('tweet', processTweet);
  };

  var processTweet = function(evaluation) {
    appendToEvaluationContainer(evaluation);
    addToHeatmap(evaluation.tweet);
  };

  var addToHeatmap = function(tweet) {
    if(tweet.geo) MapModule.add(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
  };

  var appendToEvaluationContainer = function(evaluation) {
    var tweet = evaluation.tweet;
    var validation = evaluation.isOk ? "icon-thumbs-up" : "icon-thumbs-down";

    var fields = extractTweetFields(tweet);
    var attributes = _({}).extend(fields, { validation: validation });

    var source   = $("#tweet-template").html();
    var template = Handlebars.compile(source);
    var html     = template(attributes);

    $evaluationContainer.append(html);
  };

  var extractTweetFields = function(tweet) {
    var user     = '@' + tweet.user.screen_name;
    var location = tweet.user.location;
    var text     = tweet.text;

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
