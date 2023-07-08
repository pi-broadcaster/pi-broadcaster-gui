const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "src/script/preload.js")
        }
    })

    win.loadFile(path.join(__dirname, "src/index.html"))
    win.maximize()
}