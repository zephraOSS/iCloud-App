import { app } from "electron";
import { Client } from "discord-rpc";

import * as log from "electron-log";

const appList = {
        pages: "983506915235618866",
        photos: "925870035426246657",
        mail: "983509249743290368",
        numbers: "983509383940014181",
        find: "983509548197371924",
        calendar: "983509756306137139",
        contacts: "983509890301558784",
        reminders: "983510023487500318",
        notes: "983510149727653908",
        drive: "983510282301243392"
    },
    clients: Clients = {};

export function erase() {
    for (const key in clients) {
        clients[key].client.clearActivity();
        clients[key].client.destroy();

        delete clients[key];
    }
}

export function createClient(app: string, activity?: PresenceData) {
    if (clients[app]) {
        if (!clients[app].ready) {
            clients[app].client
                .login({
                    clientId: appList[app]
                })
                .then(() => {
                    log.info("[DISCORD]", `Client for ${app} created`);
                });
        }

        return;
    }

    const client = new Client({
        transport: "ipc"
    });

    clients[app] = {
        client,
        ready: false
    };

    client
        .login({
            clientId: appList[app]
        })
        .then(() => {
            log.info("[DISCORD]", `Client for ${app} created`);
        });

    client.on("ready", () => {
        clients[app].ready = true;

        if (activity) client.setActivity(activity);
    });
    client.on("error", (error) => log.error(error));
    client.on("disconnected", () => {
        clients[app]?.client?.destroy();

        delete clients[app];
    });
}

export function setActivity(app: string, activity: PresenceData) {
    activity.largeImageText = "Made by zephra";
    activity.details = activity.details.substring(0, 128);
    activity.state = activity.state?.substring(0, 128);

    if (activity.details === "") return clearActivity(app);
    if (activity.state === "") delete activity.state;
    if (!activity.largeImageKey) activity.largeImageKey = "logo";
    if (!clients[app]?.ready) return createClient(app, activity);

    if (
        clients[app].cleared ||
        checkActivities(activity, clients[app].presenceData)
    ) {
        clients[app].client.setActivity(activity);
        clients[app].presenceData = activity;
        clients[app].cleared = false;

        for (const key in clients) {
            if (key !== app && clients[key].ready)
                clients[key].client.clearActivity();
        }
    }
}

export function clearActivity(app?: string) {
    if (app) {
        if (!clients[app]?.ready) return;

        clients[app].client.clearActivity();
        clients[app].cleared = true;
    } else {
        for (const key in clients) {
            if (clients[key].ready) {
                clients[key].client.clearActivity();
                clients[key].cleared = true;
            }
        }
    }
}

function checkActivities(newA: PresenceData, oldA: PresenceData) {
    if (!oldA || Object.keys(newA).length !== Object.keys(oldA).length)
        return true;

    for (const key in newA) {
        if (newA[key] !== oldA[key]) return true;
    }

    return false;
}

app.on("before-quit", () => erase());
