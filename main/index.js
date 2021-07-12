const { app, BrowserWindow } = require('electron');
const createDock = require('./helper/create_dock');
const createTray = require('./helper/create_tray');
const createWindow = require('./helper/create_window');
const Dashboard = require('./dashboard');

const dashboard = new Dashboard();

app.whenReady().then(() => {
  createDock();
  createTray();
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
