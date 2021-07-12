const { app, BrowserWindow, globalShortcut } = require('electron');
const createDock = require('./helper/create_dock');
const createTray = require('./helper/create_tray');
const createWindow = require('./helper/create_window');
const Dashboard = require('./dashboard');

const dashboard = new Dashboard();

app.whenReady().then(() => {
  createDock();
  createTray();
  createWindow();
  globalShortcut.register('Command+Option+J', () => {
    BrowserWindow.getAllWindows().some(win => {
      win.webContents.openDevTools();
    });
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregister('Command+Option+J');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
