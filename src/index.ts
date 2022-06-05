import { app } from "electron";
import { TrayManager } from "./managers/tray";
import { init as initAutoLaunch } from "./managers/autoLaunch";

export let trayManager: TrayManager;

app.on("ready", () => {
    trayManager = new TrayManager();

    initAutoLaunch();
});
