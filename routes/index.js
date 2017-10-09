var express = require('express');
var router = express.Router();

var database = require('../database');

router.get('/', function(req, res, next) {
  // res.render('danmu');
  res.render('index');
});

router.get('/danmu', function(req, res, next) {
  res.render('danmu');
});

router.get('/api', function(req, res, next) {
  // 获取当前歌曲
  res.json([0, '', {
    welcome: database.readWelcome(),
    playlist: database.readSongList(),
    flaglist: database.readFlag()
  }])
});

module.exports = router;