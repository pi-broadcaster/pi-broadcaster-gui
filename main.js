const {app, BrowserWindow, ipcMain, nativeTheme} = require("electron")
const path = require("path")
const fs = require("fs")
const sftp = require("ssh2-sftp-client")
const SSH = require('simple-ssh');

var win, end
let remotePath = '/media/PB/config.json';
let localPath = path.join(__dirname, "data/config.json");
let config = {
    host: 'pi.local',
    port: 22,
    username: 'pi',
    password: 'pi'
}
let fin = true
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
    let client = new sftp();
    
    client.connect(config)
    .then(() => {
        console.log("get")
        return client.get(remotePath, localPath, {
            readStreamOptions: {
                encoding: "utf-8"
            }
        });
    })
    .then(() => {
        console.log("get ok")
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
        win.on("close", () => {
            console.log("window closing")
        })
    })
    .catch(err => {
        fin = false
        console.error(err)
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

async function uploadFile(localFile, remoteFile) {
    let client = new sftp()
    console.log("prepare put")
    await client.connect(config)
    .then(async () => {
        console.log(`Uploading ${localFile} to ${remoteFile} ...`);
        await client.put(localFile, remoteFile)
        .then(() => {
            console.log("put ok")  
        })
        .catch((err) => {
            fin = false
            console.error('Uploading failed:', err);
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
        })
    })
    .catch((err) => {
        fin = false
        console.error('Uploading failed:', err);
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
            if (end) end.close()
        })
    })
    client.end();
}

app.on("window-all-closed", async () => {
    console.log("window closed")
    let out = false
    if (fin) {
        end = new BrowserWindow({
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
        end.loadFile(path.join(__dirname, "src/wait.html"))
        await uploadFile(localPath, remotePath)
        let ssh = new SSH({
            host: 'pi.local',
            user: 'pi',
            pass: 'pi'
        });
        ssh.exec("echo lol && sudo reboot", {
            out: function (stdout) { console.log("stdout ", stdout); out = true; },
            err: function (stderr) { console.log("stderr ", stderr); out = true; },
            exit: function (code) { console.log("code ", code); out = true; }
        }).start();
    }
    console.log("ok fin", fin)
    setTimeout(() => { console.log("wait"); if (BrowserWindow.getAllWindows().length === 0) app.quit(); }, 1000)
});
