import { app } from "electron";
import { Browser } from "./managers/browser";

app.on("ready", () => {
    new Browser();
});
