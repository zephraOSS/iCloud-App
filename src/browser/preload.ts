import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    setIcon: (name: string) => ipcRenderer.invoke("setIcon", name),
    getPassword: async (): Promise<string> =>
        await ipcRenderer.invoke("getPassword"),
    setPassword: (password: string) =>
        ipcRenderer.invoke("setPassword", password)
});
