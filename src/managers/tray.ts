import { Tray, Menu, app } from "electron";
import { Browser } from "./browser";
import { get, set } from "./store";
import { init as initAutoLaunch } from "./autoLaunch";

import * as path from "path";

export class TrayManager {
    private tray: Tray;

    constructor() {
        this.tray = new Tray(
            path.join(app.getAppPath(), "assets/drive@32.png")
        );
        this.tray.setToolTip("iCloud (E)");
        this.tray.setContextMenu(this.createContextMenu());

        this.tray.on("click", () => {
            new Browser();
        });

        app.on("before-quit", this.tray.destroy);
    }

    private createContextMenu(): Electron.Menu {
        return Menu.buildFromTemplate([
            {
                label: `${
                    app.isPackaged ? "iCloud" : "iCloud - DEV"
                } V.${app.getVersion()}`,
                icon: path.join(app.getAppPath(), "assets/drive@32.png"),
                enabled: false
            },
            {
                label: "Settings",
                enabled: false
            },
            { type: "separator" },
            {
                label: "Auto Launch",
                type: "checkbox",
                checked: get("autoLaunch"),
                click() {
                    set("autoLaunch", !get("autoLaunch"));
                    initAutoLaunch();
                }
            },
            {
                label: "Save Apple-ID Password (Encrypted)",
                type: "checkbox",
                checked: get("savePassword"),
                click() {
                    set("savePassword", !get("savePassword"));
                }
            },
            { type: "separator" },
            {
                label: "Restart",
                click() {
                    app.relaunch();
                    app.exit();
                }
            },
            {
                label: "Quit",
                click() {
                    app.quit();
                }
            }
        ]);
    }

    update() {
        this.tray.setContextMenu(this.createContextMenu());
    }
}
