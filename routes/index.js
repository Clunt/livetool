var express = require('express');
var config = require('../config');
var router = express.Router();

var database = require('../database');

// TODO
// 获取直播间信息 http://open.douyucdn.cn/api/RoomApi/room/${room_id}

router.get('/', function(req, res, next) {
  res.render('index', {
    config: config
  });
});

router.get('/api', function(req, res, next) {
  // 获取当前歌曲
  res.json([0, '', {}])
});

module.exports = router;