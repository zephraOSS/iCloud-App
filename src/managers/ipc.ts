import { ipcMain } from "electron";
import type { Browser } from "./browser";
import { getPassword, setPassword } from "../utils/password";
import { changeIcon } from "../utils/changeIcon";
import { setActivity, clearActivity } from "./discord";
import { get } from "./store";

export function init(browser: Browser) {
    ipcMain.handle("setIcon", (_e, name: string, data?: string) => {
        if (name === "settings") return changeIcon(browser, "drive");

        changeIcon(browser, name, data);
    });

    ipcMain.handle("setPassword", (_e, password: string) =>
        setPassword(password)
    );

    ipcMain.handle("getPassword", async (_e) => {
        return await getPassword();
    });

    ipcMain.handle("setActivity", (_e, app: string, activity: PresenceData) => {
        if (get("discordRPC")) setActivity(app, activity);
    });

    ipcMain.handle("clearActivity", (_e, app: string) => {
        clearActivity(app);
    });
}
