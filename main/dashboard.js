const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store');
const getPort = require('get-port');
const createHttpServer = require('./server/http');
const createWebSocketServer = require('./server/websocket');
const { connectLiveStream } = require('./thirdparty');
const IPC_CHANNEL = require('../ipc_channel');

Store.initRenderer();

function Dashboard() {
  this.store = new Store();
  this.liveInfo = null;
  this.defaultPort = 6688;
  this.initialized = false;
  this.bindEvent();
}

Dashboard.prototype.bindEvent = function() {
  ipcMain.on(IPC_CHANNEL.HIDE_APPLICATION, event => {
    app.setActivationPolicy('accessory');
  });

  ipcMain.handle(IPC_CHANNEL.DASHBOARD_STATUS, event => {
    if (this.initialized) {
      return [0, this.liveInfo];
    } else {
      return [1]
    }
  });

  ipcMain.handle(IPC_CHANNEL.DASHBOARD_SETTING, event => {
    return [0, { port: this.getPort() }];
  });

  ipcMain.on(IPC_CHANNEL.UPDATE_DASHBOARD_PORT, async (event, port) => {
    this.port = port;
    this.store.set('dashboard.port', port);
  });

  ipcMain.handle(IPC_CHANNEL.LIVE_START, async (event, { platform, roomId }) => {
    try {
      if (this.initialized) {
        throw new Error(`Dashboard initialized ${this.liveInfo.roomId}`);
      }
      const { info, create } = await connectLiveStream({ platform, roomId });
      const liveInfo = Object.assign({}, info, { platform });
      this.initialize(liveInfo, create);
      return [0, liveInfo];
    } catch (e) {
      return [1, e.message];
    }
  });

  ipcMain.handle(IPC_CHANNEL.CHART_MESSAGE_HISTORY, async event => {
    try {
      if (this.liveStream && this.liveStream.getMessageHistory) {
        const messages = await this.liveStream.getMessageHistory();
        return [0, messages];
      }
    } catch (e) {
    }
    return [0, {}];
  });
};

Dashboard.prototype.initialize = async function(liveInfo, createLiveStream) {
  this.initialized = true;
  this.port = this.getPort();
  this.liveInfo = liveInfo;
  this.store.set({
    live: this.liveInfo,
    dashboard: {
      port: this.port,
    },
  });
  this.liveStream = createLiveStream();
  this.httpServer = createHttpServer(this.port);
  // this.websocketServer = createWebSocketServer(this.httpServer.server, '/socket');

  this.liveStream.emitter.on('message', (message, seq) => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(IPC_CHANNEL.CHART_MESSAGE, message, seq);
    });
  });
};

Dashboard.prototype.getPort = function() {
  return this.port || this.store.get('dashboard.port') || this.defaultPort;
};

exports = module.exports = Dashboard;
