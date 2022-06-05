interface Window {
    electron: any;
}

let iframes = document.querySelectorAll("iframe");

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

new MutationObserver(() => {
    if (document.querySelectorAll("iframe").length !== iframes.length) {
        iframes = document.querySelectorAll("iframe");

        iframes.forEach((iframe) => {
            iframe.addEventListener("load", () => {
                const doc = iframe.contentDocument,
                    listeners = [];

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
