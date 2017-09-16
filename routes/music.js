var fs = require('fs');
var path = require('path');
var express = require('express');
var util = require('../lib/util');

var router = express.Router();

// 斗鱼点歌 -> 加入播放队列
// 网易云音乐请求下一首歌曲 <-> 歌曲播放完毕
// 网易云音乐请求是否切歌曲

var SONG_CUT = false;
var SONG_LIST = [];
var databaseMusic = path.resolve(__dirname, '../database/music.json');


function readSong() {
  var DEFAULT_SONG = '临安初雨';
  try {
    var database = fs.readFileSync(databaseMusic);
    database = util.parseJSON(database.toString()) || {};
    database.playlist = database.playlist || [];
    database.songlist = database.songlist || [];
    var song = database.playlist.shift();
    if (song) {
      // TODO push time
      // if (database.songlist.indexOf(song) < 0) {
      //   database.songlist.push(song);
      // }
      fs.writeFileSync(databaseMusic, JSON.stringify(database));
    } else {
      var random = Math.min(Math.round(Math.random() * (database.songlist.length - 1)));
      song = database.songlist[random];
    }
  } catch (e) {}
  return song || DEFAULT_SONG;
}

function writePlaylist(song) {
  try {
    song = song.trim();
    var database = fs.readFileSync(databaseMusic);
    database = JSON.parse(database.toString()) || {};
    database.playlist = database.playlist || [];
    if (database.playlist.indexOf(song) > -1) return;
    database.playlist.push(song);
    fs.writeFileSync(databaseMusic, JSON.stringify(database));
  } catch (e) {}
}

function recordSong(song) {
  song.count = 1;
  try {
    var database = fs.readFileSync(databaseMusic);
    database = JSON.parse(database.toString()) || {};
    database.current = song.name;
    database.playlist = database.playlist || [];
    var store = database.store;
    store[song.id] = store[song.id] || song;
    store[song.id].count += 1;
    fs.writeFileSync(databaseMusic, JSON.stringify(database));
  } catch (e) {}
}

// 斗鱼点歌
router.get('/play', function(req, res, next) {
  // #点歌 歌曲名/歌手#
  var song = (req.query.song || '').trim();
  var singer = (req.query.singer || '').trim();
  if (song) {
    song = [song];
    if (singer) {
      song.push(singer);
    }
    writePlaylist(song.join('-'));
  }
  res.send('ok');
});
router.get('/switch', function(req, res, next) {
  // #切歌#
  SONG_CUT = true;
  res.send('ok');
});

// 网易云音乐
router.get('/next', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.json([readSong()]);
});
router.get('/cut', function(req, res) {
  var cut = SONG_CUT;
  SONG_CUT = false;
  res.json([cut]);
});
router.get('/record', function(req, res, next) {
  var song = {
    id: req.query.id,
    name: req.query.name,
    dt: req.query.dt
  };
  recordSong(song);
  res.send('ok');
});


module.exports = router;