const SocketIO = require('socket.io');

function Socket(server) {
  this.io = SocketIO(server);
}

module.exports = function(server) {
  if (!server) return null;
  return new Socket(server);
};
