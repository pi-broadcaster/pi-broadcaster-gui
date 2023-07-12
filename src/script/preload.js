const {contextBridge, ipcRenderer} = require("electron")

contextBridge.exposeInMainWorld("theme", {
    get: () => ipcRenderer.invoke("theme-get"),
    toggle: () => ipcRenderer.send("theme-toggle")
})
contextBridge.exposeInMainWorld("config", {
    read: () => ipcRenderer.invoke("config-read"),
    update: (data) => ipcRenderer.send("config-update", data)
})