import { app } from "electron";
import { TrayManager } from "./managers/tray";
import { init as initAutoLaunch } from "./managers/autoLaunch";
import { init as initUpdater } from "./managers/updater";

export let trayManager: TrayManager;

app.on("ready", () => {
    trayManager = new TrayManager();

    initUpdater();
    initAutoLaunch();
});
