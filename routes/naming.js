var http = require('http');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('naming', {});
});

module.exports = router;