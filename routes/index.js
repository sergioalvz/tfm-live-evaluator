var express  = require('express');
var router   = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'TFM Live Evaluator' });
});

router.get('/streaming', function(req, res) {
  res.render('streaming');
});

module.exports = router;
