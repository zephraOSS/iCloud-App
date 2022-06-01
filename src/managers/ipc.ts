import { ipcMain } from "electron";
import type { Browser } from "./browser";

export function init(browser: Browser) {
    ipcMain.handle("setIcon", (_e, name: string) => {
        browser.setIcon(name);
    });
}
