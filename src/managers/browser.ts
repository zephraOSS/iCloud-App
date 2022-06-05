// @ts-ignore
import { app, shell, session, BrowserWindow } from "electron";
import { set as _setConfig, get as getConfig } from "./store";
import { init as initIPC } from "./ipc";

import * as path from "path";
import * as fs from "fs";

export class Browser {
    private static _instance: Browser;
    private readonly _window: BrowserWindow;

    constructor() {
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

        const styleContent = fs.readFileSync(
            path.join(app.getAppPath(), "browser/style.css"),
            "utf8"
        );

        this._window.webContents.openDevTools();
        this._window.webContents.userAgent =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15";
        this._window.setMenu(null);
        this._window.loadURL("https://www.icloud.com");
        this._window.webContents.on("dom-ready", () => {
            this._window.webContents.executeJavaScript(`
                let iframes = document.querySelectorAll("iframe");

                function createStyle(doc = document) {
                    console.log("cS", doc.querySelector("#electron-style"));
                    if (doc.querySelector("#electron-style")) return;

                    const style = doc.createElement("style");
    
                    style.id = "electron-style";
                    style.innerHTML = \`${styleContent}\`;
                    
                    doc.querySelector("head").appendChild(style);
                }
                
                function writeTextToInput(input, text) {
                    input.value = text;
                    input.dispatchEvent(new Event("input"));
                }
                
                async function createPasswordListener(element) {
                    const password = await window.electron.getPassword();
                    
                    setTimeout(() => {
                        writeTextToInput(element, password);
                    }, 1000);
                
                    element.addEventListener("input", (e) => {
                        window.electron.setPassword(e.target.value);
                    });
                }
                
                createStyle();
                
                new MutationObserver(() => {
                    console.log("mutate", document.querySelectorAll("iframe").length, iframes.length)
                    if (document.querySelectorAll("iframe").length !== iframes.length) {
                        iframes = document.querySelectorAll("iframe");
                        
                        iframes.forEach(iframe => {
                            iframe.addEventListener("load", () => {
                                const doc = iframe.contentDocument,
                                    listeners = [];

                                createStyle(doc);
                                
                                new MutationObserver(() => {
                                    const password = doc.querySelector("input[type=password]");

                                    if (password && !listeners.includes(password)) {
                                        createPasswordListener(password);
                                        listeners.push(password);
                                    }
                                }).observe(doc, {
                                    childList: true,
                                    subtree: true
                                });
                            });
                        });
                    }
                }).observe(document.body, {
                    childList: true,
                    subtree: true
                });
            `);
        });

        app.on("browser-window-created", (_e, window) => window.setMenu(null));
    }

    public static getInstance(): Browser {
        if (!this._instance) this._instance = new Browser();

        return this._instance;
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
