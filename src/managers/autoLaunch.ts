import { app } from "electron";
import { get } from "./store";

import AutoLaunch from "auto-launch";

import * as log from "electron-log";

export function init() {
    if (!app.isPackaged) return;

    const autoLaunch = new AutoLaunch({
        name: "iCloud (E)",
        path: app.getPath("exe")
    });

    if (get("autoLaunch")) autoLaunch.enable();
    else autoLaunch.disable();

    log.info("[AUTOLAUNCH]", "AutoLaunch initialized");
}
