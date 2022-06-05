// @ts-ignore
import { app, shell, session, BrowserWindow } from "electron";
import { set as _setConfig, get as getConfig } from "./store";
import { init as initIPC } from "./ipc";
import { inject } from "../utils/browserScript";

import * as path from "path";

export class Browser {
    private static _instance: Browser;
    private readonly _window: BrowserWindow;

    constructor() {
        if (Browser._instance) {
            Browser.show();
            return;
        }

        const windowState = getConfig("windowState");

        this._window = new BrowserWindow({
            x: windowState?.x,
            y: windowState?.y,
            webPreferences: {
                preload: path.join(app.getAppPath(), "browser/preload.js"),
                devTools: !app.isPackaged
            },
            title: "iCloud",
            icon: path.join(app.getAppPath(), "assets/apps/drive.png"),
            frame: false
        });

        initIPC(this);

        this._window.webContents.openDevTools();
        this._window.webContents.userAgent =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15";
        this._window.setMenu(null);
        this._window.loadURL("https://www.icloud.com");
        this._window.webContents.on("dom-ready", () => inject(this._window));

        app.on("browser-window-created", (_e, window) => window.setMenu(null));
    }

    public static getInstance(): Browser {
        if (!this._instance) this._instance = new Browser();

        return this._instance;
    }

    public static show() {
        Browser.getInstance().getWindow().show();
    }

    getWindow(): BrowserWindow {
        return this._window;
    }

    setIcon(name: string) {
        this._window.setIcon(
            path.join(app.getAppPath(), `assets/apps/${name}.png`)
        );
    }
}
