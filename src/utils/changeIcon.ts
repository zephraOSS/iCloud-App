import { Browser } from "../managers/browser";
import { app } from "electron";

import * as fs from "fs";
import * as path from "path";

export function changeIcon(browser: Browser, name, data?: string) {
    if (data) createIcon(data);

    browser.setIcon(name);
}

function createIcon(data: string) {
    const buffer = Buffer.from(
        data.replace(/^data:image\/png;base64,/, ""),
        "base64"
    );

    fs.writeFileSync(
        path.join(app.getAppPath(), "assets/apps/calendar.png"),
        buffer
    );
}
