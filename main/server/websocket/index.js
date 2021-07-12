const url = require('url');
const WebSocket = require('ws');
const EventEmitter = require('events');

function createWebSocketServer(httpServer, pathname) {
  const emitter = new EventEmitter();
  const server = new WebSocket.Server({
    noServer: true
  });

  server.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send('something');
  });

  upgradeHttpServer(httpServer, pathname, server);

  return { server, emitter };
}

let _upgrade_event;
let _upgrade_list = [];
function upgradeHttpServer(httpServer, pathname, server) {
  _upgrade_list.push({ pathname, server });
  _upgrade_event = _upgrade_event || httpServer.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;
    const upgrade = _upgrade_list.find(upgrade => upgrade.pathname === pathname);
    if (upgrade) {
      upgrade.server.handleUpgrade(request, socket, head, ws => {
        upgrade.server.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });
}

exports = module.exports = (httpServer, pathname) => {
  return createWebSocketServer(httpServer, pathname);
};
