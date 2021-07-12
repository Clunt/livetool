const EventEmitter = require('events');
const BilibiliSocket = require('./socket');
const { getRoomNews, getDanmuInfo, getDanmuHistory } = require('./api');

function Bilibili(roomId) {
  this.rid = roomId;
  this.uid = 0;
  this.emitter = new EventEmitter();
  this.initialize();
}

Bilibili.prototype.initialize = async function() {
  this.auth = await getDanmuInfo(this.rid);
  this.socket = new BilibiliSocket(this.auth.host_list, {
    // protover: 2,
    rid: this.rid,
    uid: this.uid,
    aid: 0,
    from: 0,
    param: [
      { type: 'string', key: 'platform', value: 'web' },
      { type: 'number', key: 'type', value: 2 },
      { type: 'string', key: 'key', value: this.auth.token }
    ]
  });
  this.socket.emitter.on('open', this.emit('open'));
  this.socket.emitter.on('heartbeat', this.emit('heartbeat'));
  this.socket.emitter.on('message', (message, seq) => this.onMessage(message, seq));
  this.socket.emitter.on('unauthorized', _ => this.authorize());
  this.socket.emitter.on('close', this.emit('close'));
  this.socket.emitter.on('error', this.emit('error'));
};

Bilibili.prototype.emit = function(type) {
  return event => this.emitter.emit(type, event);
};

Bilibili.prototype.authorize = function() {
  this.socket.destroy();
  this.initialize();
};

Bilibili.prototype.onMessage = function(message, seq) {
  this.emitter.emit('message', message, seq);
  // switch (cmd) {
  //   case MESSAGE_CMD_Danmaku: {
  //     return;
  //   }
  // }
};

Bilibili.prototype.getMessageHistory = function() {
  return getDanmuHistory(this.rid);
};

exports = module.exports = async function(roomId) {
  try {
    const info = await getRoomNews(roomId);
    return {
      info: {
        roomId: info.roomid,
        userId: info.uid,
        userName: info.uname,
        createTime: info.ctime,
        roomStatus: info.status,
      },
      create: () => new Bilibili(roomId),
    };
  } catch (e) {
    throw e;
  }
};
