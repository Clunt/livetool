var express = require('express');
var router = express.Router();

var database = require('../database');

// 斗鱼点歌 -> 加入播放队列
// 网易云音乐请求下一首歌曲 <-> 歌曲播放完毕
// 网易云音乐请求是否切歌曲

// 网易云音乐
router.get('/next', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.json([database.readSong()]);
});
router.get('/cut', function(req, res) {
  res.json([database.readSongCut()]);
});
router.get('/record', function(req, res, next) {
  database.recordSong({
    id: req.query.id,
    name: req.query.name,
    dt: req.query.dt
  });
  res.send('ok');
});


module.exports = router;