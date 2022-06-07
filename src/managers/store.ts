import Store from "electron-store";
import * as log from "electron-log";

const config = new Store({
    defaults: {
        windowState: {},
        autoLaunch: true,
        savePassword: true,
        discordRPC: true
    }
});

export function get(key: string): any {
    return config.get(key);
}

export function set(key: string, value: any): void {
    log.info("[STORE]", `${key} to ${JSON.stringify(value)}`);

    config.set(key, value);
}
