import { ipcMain } from "electron";
import type { Browser } from "./browser";
import { getPassword, setPassword, deletePassword } from "keytar";

export function init(browser: Browser) {
    ipcMain.handle("setIcon", (_e, name: string) => {
        browser.setIcon(name);
    });

    ipcMain.handle("setPassword", (_e, password: string) => {
        if (password)
            setPassword("com.zephra.icloud-app", "appleId-password", password);
        else deletePassword("com.zephra.icloud-app", "appleId-password");
    });

    ipcMain.handle("getPassword", (_e) => {
        return getPassword("com.zephra.icloud-app", "appleId-password");
    });
}
