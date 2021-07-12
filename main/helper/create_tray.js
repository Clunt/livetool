const path = require('path');
const { app, Tray, BrowserWindow } = require('electron');

let tray = null;
exports = module.exports = function createTray() {
  if (process.platform !== 'darwin') {
    return;
  }

  tray = new Tray(path.join(__dirname, '../../public/icon.jpg'));

  tray.on('click', (event, bounds, position) => {
    const isVisible = BrowserWindow.getAllWindows().some(win => win.isVisible());
    app.setActivationPolicy(isVisible ? 'accessory' : 'regular');
    app.emit('activate');
  });
};
