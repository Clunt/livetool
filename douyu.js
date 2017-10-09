const Live = require('./lib/live');
const database = require('./database');
const config = require('./config');


exports = module.exports = function(io) {
  var live = new Live(config.room_id);
  io.of('/danmu').on('connection', (socket) => {
    socket.on('disconnect', function(argument) {
      console.log(argument)
    })
    if (live.inited) {
      try {
      socket.emit('douyu', JSON.stringify({
        message: 'login success',
        m: '登陆成功'
      }));
    } catch(e) {
      console.log(e)
    }
    }
  });
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
  live.on('message', function(response) {
    var type = response.body.type;
    if (type === 'loginres') {
      // io.of('/danmu').emit('douyu', {
      //   message: '登陆成功',
      //   room_id: live.room_id,
      //   room: live.room
      // });
    } else {
      // io.of('/danmu').emit('message', response)
    }
  });
};
