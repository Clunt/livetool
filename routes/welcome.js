var express = require('express');
var router = express.Router();

var databaseWelcome = require('../database/welcome');

router.get('/', function(req, res, next) {
  var nickname = (req.query.nickname || '').trim();
  if (nickname) {
    databaseWelcome.write(nickname);
  }
  res.send('ok')
});

module.exports = router;