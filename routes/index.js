var fs = require('fs');
var path = require('path');
var express = require('express');
var util = require('../lib/util');

var router = express.Router();

var databaseWelcome = require('../database/welcome');
var databaseMusic = path.resolve(__dirname, '../database/music.json');

function readPlaylist() {
  try {
    var database = fs.readFileSync(databaseMusic);
    database = util.parseJSON(database.toString()) || {};
    return database.playlist || [];
  } catch (e) {}
  return [];
}

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/api', function(req, res, next) {
  // 获取当前歌曲
  var playlist = readPlaylist();
  res.json([0, '', {
    welcome: databaseWelcome.read(),
    playlist: playlist
  }])
});

module.exports = router;