interface Window {
    electron: any;
}

let iframes = document.querySelectorAll("iframe"),
    mutateIFrames = {};

function createStyle(doc = document) {
    if (doc.querySelector("#electron-style")) return;

    const style = doc.createElement("style");

    style.id = "electron-style";
    style.innerHTML = document.querySelector(
        "#electron-style-template"
    ).innerHTML;

    doc.querySelector("head").appendChild(style);
}

function writeTextToInput(input, text) {
    input.value = text;
    input.dispatchEvent(new Event("input"));
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

function createIconObserver(iframe: HTMLIFrameElement) {
    mutateIFrames[iframe.id] = {
        iframe,
        hidden: iframe.classList.contains("view-hidden")
    };

    new MutationObserver(() => {
        const hidden = iframe.classList.contains("view-hidden");

        if (hidden !== mutateIFrames[iframe.id].hidden) {
            if (hidden) window.electron.setIcon("drive");
            else {
                window.electron.setIcon(
                    iframe.id
                        .replace(/[\d-]/g, "")
                        .replace("iclouddrive", "drive")
                );
            }

            mutateIFrames[iframe.id].hidden = !hidden;
        } else if (
            document.querySelectorAll("iframe:not(.view-hidden)").length === 0
        )
            window.electron.setIcon("drive");
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
