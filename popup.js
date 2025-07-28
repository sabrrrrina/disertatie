// --- DELETE ---//

document.getElementById("deleteAll").addEventListener("click", () => {
    document.getElementById("deleteModal").style.display = "flex";
    document.getElementById("whitelistEditor").style.display = "none";
});

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    document.getElementById("deleteModal").style.display = "none";
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    document.getElementById("deleteModal").style.display = "none";

    const status = document.getElementById("status");
    status.textContent = "Deleting all cookies...";

    try {
        await chrome.browsingData.remove({}, { cookies: true });
        await chrome.storage.local.clear();
        status.textContent = "Cookies and whitelist cleared."; //vezi poate-l faci sa 
    }
    catch (ex) {
        status.textContent = "Error deleting cookies.";
        console.log("cookie delete err:", ex)
    }

    document.getElementById("editWhitelistBtn").style.display = "flex";
});


// --- WHITELIST --- //

async function removeDomainCookies(domain) {
    // Delete all cookies for this domain
    try {
        const cookies = await chrome.cookies.getAll({ domain });
        for (const cookie of cookies) {
            await chrome.cookies.remove({
                url: `${cookie.secure ? "https" : "http"}://${cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`,
                name: cookie.name
            });
        }
        console.log(`Cookies cleared for ${domain}`)

        //remove domain from 'handled' - optional, nu afecteaza fct
        const { handled = [] } = await chrome.storage.local.get(["handled"]);
        if (handled.includes(domain)) {
            handled.splice(handled.indexOf(domain), 1)
            await chrome.storage.local.set({ handled })
        }
        return true;
    }
    catch (ex) {
        console.log(`Error clearing cookies for ${domain}`)
        return false;
    }
}


document.getElementById("whitelist").addEventListener("click", async function () {
    const status = document.getElementById("status");
    status.textContent = "Adding webpage to whitelist...";

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const urlObj = new URL(tab.url);
    const hostname = urlObj.hostname;
    const domain = hostname.replace(/^www\./, "")

    try {
        const result = await chrome.storage.local.get(["whitelist"]);
        let whitelist = result.whitelist || [];

        if (!whitelist.includes(domain)) {
            whitelist.push(domain);
            await chrome.storage.local.set({ whitelist });
            let clearRes = await removeDomainCookies(domain);
            if (clearRes) {
                status.textContent = `${domain} added to whitelist and related cookies cleared.`;
            }
        } else {
            status.textContent = `${domain} is already in whitelist ✅`;
        }
    }
    catch (error) {
        console.error("Error adding to whitelist:", error);
        status.textContent = "Error adding domain.";
    }
})


document.getElementById("editWhitelistBtn").addEventListener("click", async function () {
    document.getElementById("editWhitelistBtn").style.display = "none"

    const editor = document.getElementById("whitelistEditor");
    const textarea = document.getElementById("whitelistTextarea");

    const result = await chrome.storage.local.get(["whitelist"]);
    const whitelist = result.whitelist || [];

    textarea.value = whitelist?.join('\n');
    editor.style.display = "block";
});


document.getElementById("saveWhitelistBtn").addEventListener("click", async function () {

    const textarea = document.getElementById("whitelistTextarea");
    const lines = textarea.value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean); // remove empty lines

    // Remove duplicates:
    const uniqueDomains = [...new Set(lines)];

    // Save whole updated whitelist to storage, replacing old one
    await chrome.storage.local.set({ whitelist: uniqueDomains });

    let msgs = []
    for await (const dom of uniqueDomains) {
        const msg = await removeDomainCookies(dom)
        msgs.push(msg)
    }
    console.log("Cookie deletion messages:\n" + msgs.join("\n"));

    document.getElementById("whitelistEditor").style.display = "none";
    document.getElementById("editWhitelistBtn").style.display = "flex"
});


document.getElementById("cancelEditBtn").addEventListener("click", () => {
    document.getElementById("whitelistEditor").style.display = "none";
    document.getElementById("editWhitelistBtn").style.display = "flex"
});



document.getElementById("retryBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const status = document.getElementById("retryStatus");
    status.textContent = "Running script again...";

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async function () {
                const content = await import(chrome.runtime.getURL("content.js"));
                content.run?.()
            },
        });
        status.textContent = "Done!";
    }
    catch (err) {
        console.error("Retry error:", err);
        status.textContent = "Failed to rerun script.";
    }
});


//for logs - INSPECT POPUP

