import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    setIcon: (name: string) => ipcRenderer.invoke("setIcon", name)
});
