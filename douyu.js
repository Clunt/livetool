const Live = require('./lib/live');
const database = require('./database');
const config = require('./config');
const shield = require('./shield');
const log = LOGGER('douyu');
const socket = require('./socket')();


exports = module.exports = function() {
  var live = new Live(config.room_id);
  socket.emitter.on('connection', (nsp, socket) => {
    if (live.inited) {
      socket.emit('login', {
        message: '登陆成功',
        room_id: live.room_id,
        room: live.room
      });
    }
  });
  live.on('response', function(err, response) {
    if (err) return log.error(err);
    log.info(response);
  });
  live.on('welcome', function(response) {
    var uid = response.body.uid;
    var autoMusic = config.auto_music[uid];
    database.addSong(autoMusic); // 自动点歌
    database.getUser(response.body.uid, (user) => {
      socket.getIO((io) => {
        io.emit('danmu', {
          type: 'welcome',
          response: response,
          user: user,
          song: autoMusic
        });
      });
    });
    database.recordUser(response.body.uid, response.body.nn);
  });
  live.on('chat', function(response) {
    if (shield(response)) return;
    socket.getIO((io) => {
      io.emit('danmu', {
        type: 'chat',
        response: response
      });
    });
    database.main(response);
  });
  live.on('gift', function(response) {
    socket.getIO((io) => {
      io.emit('danmu', {
        type: 'gift',
        response: response
      });
    });
    database.recordGift(response.body.uid, response.body.nn);
  });
  live.on('deserve', function(response) {
    socket.getIO((io) => {
      io.emit('danmu', {
        type: 'deserve',
        response: response
      });
    });
    database.recordDeserve(response);
  });
  live.on('message', function(response) {
    var type = response.body.type;
    socket.getIO((io) => {
      io.emit('danmu', {
        type: 'log',
        response: response
      });
      if (type === 'loginres') {
        io.emit('login', {
          message: '登陆成功',
          room_id: live.room_id,
          room: live.room
        });
      }
    });
    log.info(response.raw);
  });
  return live;
};
