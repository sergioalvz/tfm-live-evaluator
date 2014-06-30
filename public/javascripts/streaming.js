io = io.connect();

// Emit ready event.
io.emit('streaming:start');

// Listen for the talk event.
io.on('take_tweet', function(tweet) {
  console.log(tweet);
});

