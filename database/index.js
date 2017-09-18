var fs = require('fs');
var path = require('path');
var util = require('../lib/util');
var config = require('../config');

var permission = 4;
var DEFAULT_SONG = '临安初雨';
var databaseFlag = path.resolve(__dirname, './flag.json');
var databaseMusic = path.resolve(__dirname, './music.json');
var database = {
  welcome_list: [],
  song_list: [],
  song_cut: false
};

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
  var match = message.match(/#flag([^#]+)#/);
  if (!match) return;
  var flag = match[1].trim();
  if (!flag) return;
  try {
    var database = fs.readFileSync(databaseFlag);
    database = util.parseJSON(database) || {};
    if (Number(response.body.rg) >= 4) {
      database[flag] = database[flag] || 0;
      database[flag] += 1;
    } else if (database[flag]) {
      database[flag] += 1;
    }
    fs.writeFileSync(databaseFlag, JSON.stringify(database));
  } catch (e) {}
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
  try {
    var database = fs.readFileSync(databaseMusic);
    database = JSON.parse(database.toString()) || {};
    database.playlist = database.playlist || [];
    if (database.playlist.indexOf(result) > -1) return;
    database.playlist.push(result);
    fs.writeFileSync(databaseMusic, JSON.stringify(database));
  } catch (e) {}
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
exports.readSongCut = function() {
  var song_cut = database.song_cut;
  database.song_cut = false;
  return song_cut;
};
exports.recordSong = function(song) {
  song.count = 0;
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
};