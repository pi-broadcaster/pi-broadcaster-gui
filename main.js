const {app, BrowserWindow, ipcMain, nativeTheme} = require("electron")
const path = require("path")
const fs = require("fs")
const Client = require("ssh2-sftp-client")
const c = require('ssh2').Client

var win
let remotePath = '/media/PB';
let localPath = path.join(__dirname, "data/config.json");
let config = {
    host: 'pi',
    username: 'pi',
    password: 'pi'
}
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
    let client = new Client();
    
    client.connect(config)
    .then(() => {
        return client.get(remotePath, localPath, {
            readStreamOptions: {
                encoding: "utf-8"
            }
        });
    })
    .then(() => {
        client.end();
        //theme handle
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
        //main handle
        ipcMain.handle("config-read", () => {
            var data = fs.readFileSync(path.join(__dirname, "data/config.json"), "utf8")
            return JSON.parse(data.toString("utf8"))
        })
        ipcMain.on("config-update", (event, arg) => {
            fs.writeFile(path.join(__dirname, "data/config.json"), arg, (err) => {
                if (err) throw(err)
            })
        })
        createWindow()
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
        win.on("closed", async () => {
            let client = new Client();

            client.connect(config)
            .then(() => {
                return client.put(localPath, remotePath,{
                    writeStreamOptions: {
                      encoding: "utf-8"
                  }});
            })
            .then(() => {
                c.on('ready', function() {
                    c.exec('sudo shutdown -h now');
                })
                return client.end();
            })
            .catch(err => {
                const e = new BrowserWindow({
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
                e.loadFile(path.join(__dirname, "src/err.html"))
                e.on("closed", () => {
                    if (win) win.close()
                })
            });
        })
    })
    .catch(err => {
        const e = new BrowserWindow({
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
        e.loadFile(path.join(__dirname, "src/err.html"))
        e.on("closed", () => {
            if (win) win.close()
        })
    });
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})
