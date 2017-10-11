const EventEmitter = require('events');
const SocketIO = require('socket.io');

var socket = null;

function Socket(server) {
  this.emitter = new EventEmitter();
  this.io = null;
}

Socket.prototype.create = function (server) {
  if (this.io || !server) return;
  this.io = SocketIO(server);
  this.io.of('/').on('connection', (socket) => {
    this.emitter.emit('connection', '/', socket);
  });
  this.io.of('/admin').on('connection', (socket) => {
    this.emitter.emit('connection', '/admin', socket);
  });
};

Socket.prototype.emit = function () {
};

Socket.prototype.getIO = function(callback) {
  if (this.io) {
    callback(this.io);
  }
};

module.exports = function(server) {
  socket = socket || new Socket();
  socket.create(server)
  return socket;
};
