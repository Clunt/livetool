var http = require('http');
var express = require('express');
var config = require('../config');
var router = express.Router();

var database = require('../database');

// TODO
// 获取直播间信息

router.get('/', function(req, res, next) {
  res.render('index', {
    config: config
  });
});

router.get('/message', function(req, res, next) {
  res.render('message', {
    config: config
  });
});

router.get('/room', function(req, res, next) {
  var url = 'http://open.douyucdn.cn/api/RoomApi/room/' + config.room_id;
  http.get(url, function(response) {
    var size = 0;
    var chunks = [];
    response.on('data', function(chunk) {
      size += chunk.length;
      chunks.push(chunk);
    }).on('end', function() {
      var data = Buffer.concat(chunks, size);
      try {
        data = data.toString();
        data = JSON.parse(data);
        res.json([0, '', data])
      } catch(e) {
        return res.json([1, '', {}]);
      }
    });
  }).on('error', function(e) {
    return res.json([1, '', {}]);
  });
});

router.get('/api', function(req, res, next) {
  // 获取当前歌曲
  res.json([0, '', {}])
});

module.exports = router;
