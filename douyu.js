const Live = require('./lib/live');
const database = require('./database');
const config = require('./config');
const log = LOGGER('douyu');


exports = module.exports = function(io) {
  var live = new Live(config.room_id);
  io.of('/danmu').on('connection', (socket) => {
    if (live.inited) {
      socket.emit('douyu', {
        message: '登陆成功',
        room_id: live.room_id,
        room: live.room
      });
    }
  });
  live.on('welcome', function(response) {
    database.getUser(response.body.uid, function(exit) {
      io.of('/danmu').emit('welcome', response, exit);
    });
    database.recordUser(response.body.uid, response.body.nn);
  });
  live.on('chat', function(response) {
    io.of('/danmu').emit('chat', response);

    // 点歌相关
    var nickname = response.body.nn.trim();
    var message = response.body.txt.trim();
    message = message.replace(/＃/g, '#');
    database.writeFlag(response, nickname, message);;
    database.writeSong(response, nickname, message);;
    database.cutSong(response, nickname, message);;
  });
  live.on('gift', function(response) {
    io.of('/danmu').emit('gift', response);
    database.recordGift(response.body.uid, response.body.nn);
  });
  live.on('message', function(response) {
    var type = response.body.type;
    io.of('/danmu').emit('log', response);
    log.info(response.raw);
    if (type === 'loginres') {
      io.of('/danmu').emit('douyu', {
        message: '登陆成功',
        room_id: live.room_id,
        room: live.room
      });
    }
  });
};
