import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import * as log from "electron-log";

export function init() {
    if (!app.isPackaged) return;

    checkForUpdates();

    setInterval(checkForUpdates, 1.8e6);

    autoUpdater.on(
        "update-downloaded",
        (_event, _releaseNotes, releaseName) => {
            const dialogOpts = {
                type: "info",
                buttons: ["Restart", "Later"],
                title: "Update installed",
                message: releaseName,
                detail: "An update has been installed. Please restart the app for this to take effect."
            };

            dialog
                .showMessageBox(undefined, dialogOpts)
                .then(({ response }) => {
                    if (response === 0) autoUpdater.quitAndInstall();
                });
        }
    );
}

export function checkForUpdates() {
    log.log("[UPDATER]", "Checking for Updates...");

    autoUpdater.checkForUpdatesAndNotify();
}
