import { ipcMain } from "electron";
import type { Browser } from "./browser";
import { getPassword, setPassword } from "../utils/password";
import { changeIcon } from "../utils/changeIcon";

export function init(browser: Browser) {
    ipcMain.handle("setIcon", (_e, name: string, data?: string) =>
        changeIcon(browser, name, data)
    );

    ipcMain.handle("setPassword", (_e, password: string) =>
        setPassword(password)
    );

    ipcMain.handle("getPassword", async (_e) => {
        return await getPassword();
    });
}
