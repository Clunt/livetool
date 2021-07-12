const EventEmitter = require('events');
const WebSocket = require('ws');
const CONSTANT = require('./constant');
const Converter = require('./converter');
const { BrotliDecode } = require('./brotli_decode');
const { flatData, parseOptionsParam, mergeArrayBuffer } = require('./util');

function BilibiliSocket(urls, auth) {
  this.urls = urls.map(i => `wss://${i.host}:${i.wss_port}/sub`).concat('wss://broadcastlv.chat.bilibili.com:443/sub');
  this.auth = {
    uid: auth.uid,
    rid: auth.rid,
    aid: auth.aid,
    from: auth.from,
    param: auth.param,
    origin: '',
    encode: ''
  };
  this.connectTimeout = 5000;
  this.connectTimeoutTimer = 0;
  this.heartBeatTimer = 0;
  this.heartBeatInterval = 30;
  this.emitter = new EventEmitter();
  this.converter = new Converter();
  this.initialize();
}

BilibiliSocket.prototype.initialize = function() {
  const ws = this.ws = new WebSocket(this.urls.shift());
  ws.binaryType = 'arraybuffer';
  ws.on('open', _ => this.onOpen());
  ws.on('close', _ => this.onClose());
  ws.on('error', event => this.onError(event));
  ws.on('message', event => this.onMessage(event));
  this.connectTimeoutTimer = setTimeout(() => this.ws.close(), this.connectTimeout);
};

BilibiliSocket.prototype.onOpen = function() {
  this.emitter.emit('open');
  clearTimeout(this.connectTimeoutTimer);
  this.userAuthentication();
};

BilibiliSocket.prototype.onClose = function() {
  // TODO 重试、切流
  this.emitter.emit('close');
};

BilibiliSocket.prototype.onError = function(event) {
  this.emitter.emit('error', event);
};

BilibiliSocket.prototype.destroy = function() {
  this.emitter && this.emitter.removeAllListeners();
  this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
  this.connectTimeoutTimer && clearTimeout(this.connectTimeoutTimer);
  this.ws && this.ws.close();
  this.ws = null
};

BilibiliSocket.prototype.userAuthentication = function() {
  const payload = {
    uid: parseInt(this.auth.uid, 10),
    roomid: parseInt(this.auth.rid, 10),
    protover: 3,
  };

  if (this.auth.aid) {
    payload.aid = parseInt(this.auth.aid, 10);
  }

  if (this.auth.from > 0) {
    payload.from = parseInt(this.auth.from, 10) || 7;
  }

  this.auth.param.forEach(param => {
    payload[param.key] = parseOptionsParam(payload, param);
  });

  const body = this.converter.toArrayBuffer(JSON.stringify(payload), CONSTANT.WS_OP_USER_AUTHENTICATION);
  this.auth.origin = payload;
  this.auth.encode = body;

  setTimeout(() => this.ws.send(body), 0);
};

BilibiliSocket.prototype.heartBeat = function() {
  clearTimeout(this.heartBeatTimer);
  this.ws.send(this.converter.toArrayBuffer({}, CONSTANT.WS_OP_HEARTBEAT));
  this.heartBeatTimer = setTimeout(() => this.heartBeat(), 1000 * this.heartBeatInterval);
};

BilibiliSocket.prototype.onConnect = function(message) {
  const body = flatData(message.body)[0];
  if (body) {
    switch (body.code) {
      case CONSTANT.WS_AUTH_OK:
        return this.heartBeat();
      case CONSTANT.WS_AUTH_TOKEN_ERROR:
        return this.emitter.emit('unauthorized', message);
      default:
        return this.onClose();
    }
  } else {
    return this.heartBeat();
  }
};

BilibiliSocket.prototype.onMessage = function(event) {
  try {
    flatData(this.converter.toObject(event)).forEach(message => {
      switch (message.op) {
        case CONSTANT.WS_OP_CONNECT_SUCCESS:
          return this.onConnect(message);
        case CONSTANT.WS_OP_HEARTBEAT_REPLY:
          return this.emitter.emit('heartbeat', message.body);
        case CONSTANT.WS_OP_MESSAGE:
          return flatData(message.body).forEach(msg => {
            this.emitter.emit('message', msg, message.seq);
          });
      }
    });
  } catch (e) {
    console.error('WebSocket Error: ', e);
  }
};

exports = module.exports = BilibiliSocket;
