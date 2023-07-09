const {app, BrowserWindow, ipcMain, nativeTheme} = require("electron")
const path = require("path")
const fs = require("fs")

var win
function createWindow() {
    win = new BrowserWindow({
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: (nativeTheme.shouldUseDarkColors) ? "#212121" : "#ffffff",
            symbolColor: (nativeTheme.shouldUseDarkColors) ? "#ffffff" : "#000000",
            height: 26
        },
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "src/script/preload.js")
        }
    })

    win.setIcon(path.join(__dirname, "src/icon.ico"))
    win.loadFile(path.join(__dirname, "src/index.html"))
    win.maximize()
}

app.whenReady().then(() => {
    ipcMain.handle("theme-get", () => {
        return (nativeTheme.shouldUseDarkColors) ? "light" : "dark"
    })
    ipcMain.on("theme-toggle", () => {
        nativeTheme.themeSource = (nativeTheme.shouldUseDarkColors) ? "light" : "dark"
        win.setTitleBarOverlay({
            color: (nativeTheme.shouldUseDarkColors) ? "#212121" : "#ffffff",
            symbolColor: (nativeTheme.shouldUseDarkColors) ? "#ffffff" : "#000000",
            height: 26
        })
    })
    ipcMain.handle("config-read", () => {
        var data = fs.readFileSync(path.join(__dirname, "config.json"), "utf8")
        return JSON.parse(data.toString("utf8"))
    })
    createWindow()
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})