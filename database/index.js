// TODO 文件记录丢失问题
const fs = require('fs');
const path = require('path');
const util = require('../lib/util');
const config = require('../config');
const log = LOGGER('database');

var permission = 4;
var DEFAULT_SONG = '临安初雨';
var databaseRecord = path.resolve(__dirname, './record.json');
var databaseFlag = path.resolve(__dirname, './flag.json');
var databaseMusic = path.resolve(__dirname, './music.json');
var database = {
  welcome_list: [],
  song_list: [],
  song_cut: false
};

function readDatabase(path, callback) {
  try {
    var data = fs.readFileSync(path);
    callback(util.parseJSON(data) || {});
  } catch (e) {}
}

function writeDatabase(path, callback) {
  try {
    var data = fs.readFileSync(path);
    var database = util.parseJSON(data);
    if (!database) return log.error('数据记录出错', path, data);
    callback(function(database) {
      try {
        if (typeof database !== 'object') return;
        fs.writeFileSync(path, JSON.stringify(database));
      } catch(e) {}
    }, database);
  } catch (e) {}
}

exports = module.exports = database;

exports.writeWelcome = function(response, nickname) {
  database.welcome_list.push(nickname);
};
exports.readWelcome = function() {
  var welcome_list = JSON.parse(JSON.stringify(database.welcome_list));
  database.welcome_list = [];
  return welcome_list;
};

exports.writeFlag = function(response, nickname, message) {
  var match = message.match(/#flag([^#]+)#/i);
  if (!match) return;
  var flag = match[1].trim();
  if (!flag) return;
  writeDatabase(databaseFlag, function(save, database) {
    if (Number(response.body.rg) >= 4) {
      database[flag] = database[flag] || 0;
      database[flag] += 1;
    } else if (database[flag]) {
      database[flag] += 1;
    }
    save(database);
  });
};
exports.readFlag = function() {
  var database = fs.readFileSync(databaseFlag);
  return util.parseJSON(database.toString()) || {};
};

exports.writeSong = function(response, nickname, message) {
  // #点歌 歌曲名/歌手# | #点歌 歌曲名# | #点歌 歌手#
  var match = message.match(/#点歌([^/#]+)(\/([^#]+))?#/);
  if (!match) return;
  var song = (match[1] || '').trim();
  var singer = (match[3] || '').trim();
  var value = [];
  if (song) {
    value.push(song);
  }
  if (singer) {
    value.push(singer);
  }
  if (!value.length) return;
  var result = value.join('-');
  writeDatabase(databaseMusic, function(save, database) {
    database.playlist = database.playlist || [];
    if (database.playlist.indexOf(result) > -1) return;
    database.playlist.push(result);
    save(database);
  });
};
exports.readSong = function() {
  var song = '';
  try {
    var database = fs.readFileSync(databaseMusic);
    database = util.parseJSON(database.toString()) || {};
    database.playlist = database.playlist || [];
    database.songlist = database.songlist || [];
    song = database.playlist.shift();
    if (song) {
      fs.writeFileSync(databaseMusic, JSON.stringify(database));
    } else {
      var random = Math.min(Math.round(Math.random() * (database.songlist.length - 1)));
      song = database.songlist[random];
    }
  } catch (e) {}
  return song || DEFAULT_SONG;
};
exports.readSongList = function() {
  var playlist = [];
  try {
    var database = fs.readFileSync(databaseMusic);
    database = util.parseJSON(database.toString()) || {};
    playlist = database.playlist || [];
    if (database.current) {
      playlist.unshift(database.current)
    }
  } catch (e) {}
  return playlist;
};
exports.cutSong = function(response, nickname, message) {
  database.song_cut = !!message.match(/#切歌#/);
};
exports._cutSong = function() {
  database.song_cut = true;
};
exports.readSongCut = function() {
  var song_cut = database.song_cut;
  database.song_cut = false;
  return song_cut;
};
exports.recordSong = function(song) {
  song.count = 0;
  writeDatabase(databaseMusic, function(save, database) {
    database.current = song.name;
    database.playlist = database.playlist || [];
    var store = database.store;
    store[song.id] = store[song.id] || song;
    store[song.id].count += 1;
    save(database);
  });
};
exports.recordGift = function(uid, name) {
  if (!uid) return;
  writeDatabase(databaseRecord, function(save, database) {
    database.gift = database.gift || {};
    database.gift[uid] = database.gift[uid] || 0;
    database.gift[uid] += 1;
    save(database);
  });
};
exports.recordUser = function(uid, name) {
  if (!uid) return;
  writeDatabase(databaseRecord, function(save, database) {
    database.user = database.user || {};
    database.user[uid] = database.user[uid] || {
      times: 0,
      names: []
    };
    database.user[uid].times += 1;
    if (database.user[uid].names.indexOf(name) < 0) {
      database.user[uid].names.push(name);
    }
    save(database);
  });
};

exports.getUser = function(uid, callback) {
  if (!uid) return;
  readDatabase(databaseRecord, function(database) {
    var users = database.user || {};
    var user = users[uid];
    callback(user);
  });
};