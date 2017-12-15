const electron = require('electron')
// Set up autoupdater
const autoUpdater = require("electron-updater").autoUpdater
autoUpdater.checkForUpdatesAndNotify(); // check for updates on startup

//Include other libs
const path = require('path');

// Module to control application life.
const app = electron.app
const {ipcMain} = require('electron')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
//Adds the main Menu to our app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let secondWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'build/64x64.png')
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()


  // Show the mainwindow when it is loaded and ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  secondWindow = new BrowserWindow({frame: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'build/64x64.png'),
    parent: mainWindow
  })

  secondWindow.loadURL(`file://${__dirname}/windows/ipcwindow.html`)

  require('./menu/mainmenu')
}

ipcMain.on('open-second-window', (event, arg)=> {
    secondWindow.show()
})

ipcMain.on('close-second-window', (event, arg)=> {
    secondWindow.hide()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var SteamApi = require('steam-api');

// User Settings
const settings = require('electron-settings');
app.on('ready', () => {
  // Configure defaults
  if (!settings.has('theme')){
    settings.set('theme', 'default');
  }

  // Update Steam API key when its changed in app
  settings.watch('providers.steam.api_key', (newValue, oldValue) => {
    process.env.STEAM_API_KEY = newValue;
    console.log("Steam API Key: " + settings.get('providers.steam.api_key'));
  });
  
  // User key changed? Re-roll globals
  settings.watch('providers.steam.api_key', (newValue, oldValue) => {

  });

  
   console.log("Current Theme: " + settings.get('theme'));
   console.log("Steam API Key: " + settings.get('providers.steam.api_key'));
   console.log("Steam API ID: " + settings.get('providers.steam.id'));

   if (settings.has('providers.steam.api_key') && settings.has('providers.steam.id')){
    const SteamApi = require('./providers/steam.js');
    var api = new SteamApi(settings.get('providers.steam.api_key'))
    api.User_GetPlayerSummaries(settings.get('providers.steam.id'))
  }

});