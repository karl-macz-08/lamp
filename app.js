const { app, BrowserWindow, Menu } = require('electron');

app.on('window-all-closed', () => {
  if(process.platform !== "darwin") {
    app.quit();
  }
});

app.on('ready', () => {
  let win = new BrowserWindow({
    resizable: false,
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
  });

  mainWindow.loadURL('file://' + __dirname + '/system/browser.html');
  Menu.setApplicationMenu(null);

  win.on('ready-to-show', () => {
    win.show();
  });

  win.on('close', () => {
    win = null;
  });
});
