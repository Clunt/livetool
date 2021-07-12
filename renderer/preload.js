const { contextBridge, ipcRenderer } = require('electron');
const IPC_CHANNEL = require('../ipc_channel');
const Store = require('electron-store');


const store = new Store();
const ipcMethods = [
  ['getDashboardStatus', IPC_CHANNEL.DASHBOARD_STATUS, 'invoke'],
  ['getDashboardSetting', IPC_CHANNEL.DASHBOARD_SETTING, 'invoke'],
  ['updateDashboardPort', IPC_CHANNEL.UPDATE_DASHBOARD_PORT, 'send'],
  ['getChartMessageHistory', IPC_CHANNEL.CHART_MESSAGE_HISTORY, 'invoke'],
  ['onChartMessage', IPC_CHANNEL.CHART_MESSAGE, 'on'],
  ['hideApp', IPC_CHANNEL.HIDE_APPLICATION, 'send'],
  ['startLive', IPC_CHANNEL.LIVE_START, 'invoke'],
];

contextBridge.exposeInMainWorld('LIVETOOL_BRIDGE', {
  store: {
    get: (...args) => store.get(...args),
    set: (...args) => store.set(...args),
  },
  ipc: ipcMethods.reduce((ipc, [method, channel, type]) => {
    ipc[method] = payload => {
      const instance = ipcRenderer[type](channel, payload);
      return (instance && instance.then) ? instance.then(response => {
        const [ code, data ] = [].concat(response);
        if (code === 0) {
          return data;
        } else {
          throw new Error(data || `code(${code})`);
        }
      }) : instance;
    };
    return ipc;
  }, {})
});


