const path = require('path');
const { app, BrowserWindow } = require('electron');

let win;
const ROOT_DIRNAME = path.join(__dirname, '../../');
exports = module.exports = function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(ROOT_DIRNAME, 'renderer/preload.js'),
    }
  });

  win.on('closed', () => {
    app.setActivationPolicy('accessory');
    win = null;
  });

  win.loadFile(path.join(ROOT_DIRNAME, 'renderer/index.html'));

  app.setActivationPolicy('regular');
}
