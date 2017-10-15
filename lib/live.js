const net = require('net');
const EventEmitter = require('events');

var HOST = 'openbarrage.douyutv.com';
var PORT = 8601;

function parse(response) {
  var typeIndex = response.indexOf('type@=');
  if (typeIndex < 0) return null;
  response = response.slice(typeIndex);
  var responseArray = response.split('/');
  var responseObject = {};
  responseArray.forEach(function(message) {
    if (!message) return;
    var msgArr = message.split('@=');
    var key = String(msgArr[0]).trim();
    var value = msgArr[1];
    if (key.length === 0) return;
    responseObject[key] = (value || '').replace(/@S/g, '/').replace(/@A/g, '@');
  });
  if (!responseObject.type) return null;
  return {
    raw: response,
    body: responseObject
  };
}


function Live(room_id) {
  this.inited = false;
  this.room_id = room_id;
  this.socket = null;
  this.emitter = new EventEmitter();
  this.init();
}

Live.prototype.init = function() {
  this.socket = net.connect(PORT, HOST, () => {
    console.log('登陆:', this.room_id);
    this.send('type@=loginreq/roomid@=' + this.room_id + '/');
  });
  this.heartbeat();
  this.listen((err, res) => {
    this.log(err, res);
    this.emitter.emit('response', err, res);
    if (err) return;
    var type = res.body.type;
    var types = {
      uenter: 'welcome',
      chatmsg: 'chat',
      dgb: 'gift',
      bc_buy_deserve: 'deserve'
    };
    if (type === 'loginres') {
      this.room = res.body;
      this.inited = true;
      console.log('登陆成功:', this.room_id);
      console.log('加入全局分组');
      this.send('type@=joingroup/rid@=' + this.room_id + '/gid@=-9999/');
    }
    if (types[type]) {
      this.emitter.emit(types[type], res);
    }
    this.emitter.emit('message', res);
  });
};

Live.prototype.on = function(event, callback) {
  this.emitter.on(event, callback);
};

Live.prototype.log = function(err, res) {
  // console.log(JSON.stringify(res.body));
};

Live.prototype.listen = function(callback) {
  this.socket.on('data', (data) => {
    // TODO 拆包
    var response = data.toString();
    var responseObject = parse(response);
    if (!responseObject) {
      var error = new Error('未知响应');
      error.response = response;
      return callback(error);
    }
    callback(null, responseObject);
  });
  this.socket.on('close', (data) => {
    // TODO
    console.log('CLOSE', data.toString());
    this.socket = null;
    process.exit();
  })
};

Live.prototype.send = function(payload) {
  if (!this.socket) return;
  var data = new Buffer(4 + 4 + 4 + payload.length + 1)
  data.writeInt32LE(4 + 4 + payload.length + 1, 0); //length
  data.writeInt32LE(4 + 4 + payload.length + 1, 4); //code
  data.writeInt32LE(0x000002b1, 8); //magic
  data.write(payload, 12); //payload
  data.writeInt8(0, 4 + 4 + 4 + payload.length); //end of string
  this.socket.write(data);
};

Live.prototype.heartbeat = function() {
  setInterval(() => {
    this.send('type@=mrkl/');
  }, 40 * 1000);
};

exports = module.exports = Live;
