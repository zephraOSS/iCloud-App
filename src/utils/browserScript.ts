import { app, BrowserWindow } from "electron";

import * as path from "path";
import * as fs from "fs";

export function inject(window: BrowserWindow) {
    const styleContent = fs.readFileSync(
            path.join(app.getAppPath(), "browser/style.css"),
            "utf8"
        ),
        scriptContent = fs.readFileSync(
            path.join(app.getAppPath(), "browser/script.js"),
            "utf8"
        );

    window.webContents.executeJavaScript(`
        const style = document.createElement("style");

        style.id = "electron-style-template";
        style.innerHTML = \`${styleContent}\`;

        document.querySelector("head").appendChild(style);

        ${scriptContent}
    `);
}
