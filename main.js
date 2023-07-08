const {app, BrowserWindow, ipcMain, nativeTheme, globalShortcut} = require("electron")
const path = require("path")

function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "src/script/preload.js")
        }
    })

    win.setIcon(path.join(__dirname, "src/icon.ico"))
    win.loadFile(path.join(__dirname, "src/index.html"))
    win.maximize()
}

function toggleTheme() {
   if (nativeTheme.shouldUseDarkColors) nativeTheme.themeSource = "light"
   else nativeTheme.themeSource = "dark"
}

app.whenReady().then(() => {
    globalShortcut.register("CommandorControl+Alt+T", () => {
        toggleTheme()
    })
    createWindow()
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})