const { app, BrowserWindow, Menu } = require('electron');

app.on('window-all-closed', () => {
  if(process.platform !== "darwin") {
    app.quit();
  }
});

app.on('ready', () => {
  let win = new BrowserWindow({
    height: 500,
    width: 250,
    x: 0,
    y: 0,
    resizable: false,
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
  });

  win.loadURL(`file://${__dirname}/src/index.html`);
  win.webContents.openDevTools();
  Menu.setApplicationMenu(null);

  win.on('ready-to-show', () => {
    win.show();
  });

  win.on('close', () => {
    win = null;
  });
});
