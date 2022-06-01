interface Window {
    electron: any;
}

let savedIFrames = {};

setDragZone();

setInterval(() => {
    const iframes = document.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
        if (iframe && !savedIFrames[iframe.id]) {
            savedIFrames[iframe.id] = {
                iframe,
                hidden: false
            };

            new MutationObserver(() => {
                function checkOpensOtherApp(exclude: HTMLIFrameElement) {
                    let isHidden = 0;

                    iframes.forEach((iframe) => {
                        if (
                            iframe !== exclude &&
                            iframe.classList.contains("view-hidden")
                        )
                            isHidden++;
                    });

                    console.log(isHidden, iframes.length);

                    return (isHidden = iframes.length - 1);
                }

                const hidden = iframe.classList.contains("view-hidden"),
                    opensOtherApp = checkOpensOtherApp(iframe);

                console.log("opensOtherApp", opensOtherApp);

                if (hidden !== savedIFrames[iframe.id].hidden) {
                    if (hidden) window.electron.setIcon("drive");
                    else {
                        window.electron.setIcon(
                            iframe.id
                                .replace(/[\d-]/g, "")
                                .replace("iclouddrive", "drive")
                        );
                    }

                    savedIFrames[iframe.id].hidden = hidden;
                }
            }).observe(iframe, {
                attributes: true,
                attributeFilter: ["class"]
            });

            setDragZone(iframe.contentDocument, true);

            window.electron.setIcon(
                iframe.id.replace(/[\d-]/g, "").replace("iclouddrive", "drive")
            );
            iframe.addEventListener("load", () =>
                setDragZone(iframe.contentDocument, true)
            );
        }
    });
}, 1000);

function setDragZone(doc = document, isApp = false) {
    let clear = 0,
        toolbar = doc.querySelector<HTMLDivElement>(".toolbar-view"),
        username = doc.querySelector<HTMLDivElement>(".user-name-with-chevron"),
        appSelect = doc.querySelector<HTMLDivElement>(
            ".application-toolbar-left-view"
        );

    const interval = setInterval(() => {
        toolbar = doc.querySelector(".toolbar-view");
        username = doc.querySelector(".user-name-with-chevron");
        if (isApp)
            appSelect = doc.querySelector(".application-toolbar-left-view");

        if (toolbar) {
            clear++;
            // @ts-ignore
            toolbar.style.webkitAppRegion = "drag";
        }

        if (username) {
            clear++;
            // @ts-ignore
            username.style.webkitAppRegion = "no-drag";
        }

        if (isApp && appSelect) {
            clear++;
            // @ts-ignore
            appSelect.style.webkitAppRegion = "no-drag";
        }

        if ((!isApp && clear >= 2) || (isApp && clear >= 3))
            clearTimeout(interval);
    }, 100);
}
