interface Window {
    electron: any;
}

let iframes = document.querySelectorAll("iframe"),
    mutateIFrames = {},
    mutateActivities = [];

function createStyle(doc = document) {
    if (doc.querySelector("#electron-style")) return;

    const style = doc.createElement("style");

    style.id = "electron-style";
    style.innerHTML = document.querySelector(
        "#electron-style-template"
    ).innerHTML;

    doc.querySelector("head").appendChild(style);
}

function replaceName(name: string) {
    return name?.replace("iclouddrive", "drive").replace(/[\d-]/g, "");
}

function writeTextToInput(input, text) {
    input.value = text;
    input.dispatchEvent(new Event("input"));
}

function setActivity(app: string, activity: PresenceData) {
    window.electron.setActivity(replaceName(app), activity);
}

function clearActivity(app?: string) {
    window.electron.clearActivity(replaceName(app));
}

async function createPasswordListener(element) {
    const password = await window.electron.getPassword();

    setTimeout(() => {
        writeTextToInput(element, password);
    }, 1000);

    element.addEventListener("input", (e) => {
        window.electron.setPassword(e.target.value);
    });
}

function getCalendarIcon() {
    return (
        document.querySelector<HTMLImageElement>(
            "img.calendar-icon-view.app-icon-view"
        )?.src ?? ""
    );
}

function initiateActivity(app: string) {
    if (mutateActivities.includes(app)) return;

    mutateActivities.push(app);

    switch (app) {
        case "mail2": {
            setActivity(app, {
                details: "Reading their Emails"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#mail2"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const activeMail =
                        doc.querySelector<HTMLDivElement>(
                            ".thread-list-inner:focus-within .ic-1iosphu .selection-background"
                        ) ??
                        doc.querySelector<HTMLDivElement>(
                            ".thread-list-inner:not(:focus-within) .ic-1iosphu .selection-background"
                        );

                    if (activeMail) {
                        const subject = activeMail.querySelector(
                                ".thread-subject span"
                            )?.textContent,
                            sender = activeMail.querySelector(
                                ".thread-participants"
                            )?.textContent;

                        setActivity(app, {
                            details: `Reading an Email from ${sender}`,
                            state: subject
                        });
                    } else {
                        setActivity(app, {
                            details: "Reading their Emails"
                        });
                    }
                }).observe(doc, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "contacts": {
            setActivity(app, {
                details: "Viewing their Contacts"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#contacts"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const activeContact = doc.querySelector<HTMLDivElement>(
                        ".contacts.sticky-header-scroll-view.contact-list .headered-list-view .headered-list-item.sel"
                    );

                    if (activeContact) {
                        const name =
                                activeContact.querySelector(
                                    "label"
                                )?.textContent,
                            surname =
                                activeContact.querySelector(
                                    "label > strong"
                                )?.textContent;

                        setActivity(app, {
                            details: `Viewing a Contact`,
                            state:
                                name !== surname
                                    ? name.replace(surname, "")
                                    : name
                        });
                    } else {
                        setActivity(app, {
                            details: "Viewing their Contacts"
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "calendar": {
            setActivity(app, {
                details: "Viewing their Calendar"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#calendar"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const editEvent = doc.querySelector<HTMLDivElement>(
                            ".calendar.sc-view.sc-panel.pop-over.event-inspector-panel.picker.popme"
                        ),
                        timeSpan = doc.querySelector(
                            ".calendar.sc-view.navigation-control-date"
                        );

                    if (editEvent) {
                        const title =
                            editEvent.querySelector<HTMLInputElement>(
                                'input[aria-label="Event Title"]'
                            )?.value ??
                            editEvent.querySelector<HTMLDivElement>(
                                ".calendar.sc-view.sc-label-view.inspector-title"
                            )?.textContent;

                        setActivity(app, {
                            details: "Editing an Event",
                            state: title
                        });
                    } else {
                        setActivity(app, {
                            details: "Viewing their Calendar",
                            state: timeSpan?.textContent
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "photos3": {
            setActivity(app, {
                details: "Viewing their Photos"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#photos3"
                )?.contentDocument;

            if (doc) {
                const timeSpan = doc.querySelector<HTMLSpanElement>(
                    ".grid-header-view.grid-header-view-v2 > .top-row .grid-title > span"
                )?.textContent;

                new MutationObserver(() => {
                    const activePhoto = doc.querySelector<HTMLDivElement>(
                            ".pok-derivative-display-elements-positioner"
                        ),
                        category = doc.querySelector<HTMLSpanElement>(
                            ".SidebarItemWrapper.SidebarItem.is-selected .SidebarItem-title span > span"
                        )?.textContent;

                    if (activePhoto) {
                        const date = doc.querySelector<HTMLDivElement>(
                            "div.title-content > div.title-text"
                        )?.textContent;

                        setActivity(app, {
                            details: "Viewing a Photo",
                            state: date
                        });
                    } else {
                        setActivity(app, {
                            details: `Viewing ${category ?? "their Photos"}`,
                            state: timeSpan
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "iclouddrive": {
            setActivity(app, {
                details: "Viewing their iCloud Drive"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#iclouddrive"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    let path = "";

                    doc.querySelectorAll<HTMLDivElement>(
                        ".path-bar-item"
                    ).forEach((item) => (path += item.textContent + "/"));

                    setActivity(app, {
                        details: "Viewing their iCloud Drive",
                        state: path.replace("iCloud Drive/", "") ?? ""
                    });
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "notes3": {
            setActivity(app, {
                details: "Viewing their Notes"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#notes3"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const activeCategory = doc.querySelector<HTMLDivElement>(
                            ".notes-folder-list-content-view.notes-list-focused .cw-list-item-view.cw-selected"
                        ),
                        activeNote = doc.querySelector<HTMLDivElement>(
                            ".notes-list-focused .list-item.is-selected"
                        ),
                        activeNoteAlt = doc.querySelector<HTMLDivElement>(
                            ".list-item.is-selected"
                        );

                    if (activeNote || (activeNoteAlt && !activeCategory)) {
                        const title =
                            activeNoteAlt.querySelector<HTMLDivElement>(
                                ".note-list-item-title"
                            )?.textContent;

                        setActivity(app, {
                            details: "Editing a Note",
                            state: title
                        });
                    } else if (activeCategory) {
                        const title =
                            activeCategory.querySelector<HTMLSpanElement>(
                                ".folder-label-container-shim > span.folder-label"
                            )?.textContent;

                        setActivity(app, {
                            details: "Viewing a Category",
                            state: title
                        });
                    } else {
                        setActivity(app, {
                            details: "Viewing their Notes"
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "reminders2": {
            setActivity(app, {
                details: "Viewing their Reminders"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#reminders2"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const activeList =
                        doc.querySelector<HTMLDivElement>(".rm-list");

                    if (activeList) {
                        const title = activeList.querySelector<HTMLDivElement>(
                                ".title-section .title .inline-editable-label"
                            )?.textContent,
                            isEditing =
                                activeList.querySelector<HTMLDivElement>(
                                    ".primary.rm-new-reminder"
                                ).style.color === "rgb(255, 255, 255)";

                        setActivity(app, {
                            details: `${
                                isEditing
                                    ? "Editing a Reminder"
                                    : "Viewing Reminders"
                            }`,
                            state: title
                        });
                    } else {
                        setActivity(app, {
                            details: "Viewing their Reminders"
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        case "find": {
            setActivity(app, {
                details: "Viewing Find My"
            });

            const doc =
                document.querySelector<HTMLIFrameElement>(
                    "iframe#find"
                )?.contentDocument;

            if (doc) {
                new MutationObserver(() => {
                    const loggingIn = doc.querySelector<HTMLDivElement>(
                            ".find-me.logged-out-view:not(.sc-hidden)"
                        ),
                        device = doc.querySelector<HTMLDivElement>(
                            ".find-me.sc-view.devices-btn.st-devicesBtn.button label"
                        )?.textContent,
                        deviceDialog = doc.querySelector<HTMLDivElement>(
                            ".find-me.sc-panel.sc-palette.device-detail-floating-view.device-action-pane.focus.panel"
                        ),
                        deviceImg =
                            deviceDialog?.querySelector<HTMLImageElement>(
                                "img.device-image"
                            )?.src;

                    if (loggingIn) {
                        setActivity(app, {
                            details: "Find My",
                            state: "Logging in"
                        });
                    } else {
                        setActivity(app, {
                            details: "Viewing Find My",
                            state: device,
                            smallImageKey: deviceDialog ? deviceImg : undefined
                        });
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            }

            break;
        }

        default:
            break;
    }
}

function createIconObserver(iframe: HTMLIFrameElement) {
    mutateIFrames[iframe.id] = {
        iframe,
        hidden: iframe.classList.contains("view-hidden")
    };

    new MutationObserver(() => {
        const hidden = iframe.classList.contains("view-hidden");

        if (hidden !== mutateIFrames[iframe.id].hidden) {
            if (hidden) {
                window.electron.setIcon("drive");
                console.log("cleaBBBr", iframe.id);
                clearActivity(iframe.id);
            } else {
                window.electron.setIcon(
                    iframe.id
                        .replace(/[\d-]/g, "")
                        .replace("iclouddrive", "drive"),
                    iframe.id === "calendar" ? getCalendarIcon() : ""
                );

                console.log("init", iframe.id);
                initiateActivity(iframe.id);
            }

            mutateIFrames[iframe.id].hidden = !hidden;
        } else if (
            document.querySelectorAll("iframe:not(.view-hidden)").length === 0
        ) {
            window.electron.setIcon("drive");
            clearActivity();
        }
    }).observe(iframe, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

new MutationObserver(() => {
    if (document.querySelectorAll("iframe").length !== iframes.length) {
        iframes = document.querySelectorAll("iframe");

        iframes.forEach((iframe) => {
            iframe.addEventListener("load", () => {
                const doc = iframe.contentDocument,
                    listeners = [];

                createIconObserver(iframe);
                createStyle(doc);

                new MutationObserver(() => {
                    const password = doc.querySelector("input[type=password]");

                    if (password && !listeners.includes(password)) {
                        createPasswordListener(password);
                        listeners.push(password);
                    }
                }).observe(doc, {
                    childList: true,
                    subtree: true
                });
            });
        });
    }
}).observe(document.body, {
    childList: true,
    subtree: true
});
