import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    setIcon: (name: string, data?: string) =>
        ipcRenderer.invoke("setIcon", name, data),
    getPassword: async (): Promise<string> =>
        await ipcRenderer.invoke("getPassword"),
    setPassword: (password: string) =>
        ipcRenderer.invoke("setPassword", password),
    setActivity: (app: string, activity: PresenceData) =>
        ipcRenderer.invoke("setActivity", app, activity),
    clearActivity: (app?: string) => ipcRenderer.invoke("clearActivity", app)
});
