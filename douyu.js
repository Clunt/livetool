var Live = require('./lib/live');
var database = require('./database');
var config = require('./config');

exports = module.exports = function() {
  var live = new Live(config.room_id);
  live.on('welcome', function(response) {
    var nickname = response.body.nn.trim();
    console.log('欢迎', nickname);
    // 记录
    database.writeWelcome(response, nickname);
  });
  live.on('chat', function(response) {
    var nickname = response.body.nn.trim();
    var message = response.body.txt.trim();
    console.log(nickname + ':', message);
    message = message.replace(/＃/g, '#');
    // 记录
    database.writeFlag(response, nickname, message);;
    database.writeSong(response, nickname, message);;
    database.cutSong(response, nickname, message);;
  });
  live.on('gift', function(response) {
    var nickname = response.body.nn.trim();
    console.log('感谢', nickname, '送的礼物');
  });
};
