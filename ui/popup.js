// --- DELETE ---//

function showElement(id) {
    document.getElementById(id).style.display = "flex";
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}


document.getElementById("deleteAll").addEventListener("click", () => {
    showElement("deleteModal")
    hideElement("whitelistEditor")
});

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    hideElement("deleteModal")
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    hideElement("deleteModal")

    const status = document.getElementById("status");
    status.textContent = "Deleting all cookies...";

    try {
        await chrome.browsingData.remove({}, { cookies: true });
        await chrome.storage.local.clear();
        status.textContent = "Cookies and whitelist cleared.";
    }
    catch (ex) {
        status.textContent = "Error deleting cookies.";
        console.log("cookie delete err:", ex)
    }

    showElement("editWhitelistBtn")
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


document.getElementById("whitelist").addEventListener("click", async () => {
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


document.getElementById("editWhitelistBtn").addEventListener("click", async () => {
    hideElement("editWhitelistBtn")

    const editor = document.getElementById("whitelistEditor");
    const textarea = document.getElementById("whitelistTextarea");

    const result = await chrome.storage.local.get(["whitelist"]);
    const whitelist = result.whitelist || [];

    textarea.value = whitelist?.join('\n');
    editor.style.display = "block";
});


document.getElementById("saveWhitelistBtn").addEventListener("click", async () => {

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
    for await (const dom of uniqueDomains) { //async.map
        const msg = await removeDomainCookies(dom)
        msgs.push(msg)
    }
    console.log("Cookie deletion messages:\n" + msgs.join("\n"));

    hideElement("whitelistEditor")
    showElement("editWhitelistBtn")
});


document.getElementById("cancelEditBtn").addEventListener("click", () => {
    hideElement("whitelistEditor")
    showElement("editWhitelistBtn")
});



// debug stuff

document.getElementById("retryBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const status = document.getElementById("status");
    status.textContent = "Running script again...";

    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: async () => {
                const content = await import(chrome.runtime.getURL("../content.js"));
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


document.getElementById("debugBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname.replace(/^www\./, "");
    const status = document.getElementById("status");

    try {
        let srvRes = await fetch("http://localhost:8080/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain: domain })
        });
        srvRes = await srvRes.json()
        console.log("srv res:", srvRes.msg)

        status.textContent = srvRes.msg;
        setTimeout(() => { status.textContent = "" }, 2000) //dispare dupa 2 sec
    }
    catch (ex) {
        status.textContent = "server fetch error";
        setTimeout(() => { status.textContent = "" }, 2000) //dispare dupa 2 sec
    }
});



// cool extra features

document.getElementById("statsBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("./ui/stats.html") });
});


document.getElementById("faqBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("./ui/faq.html") });
});


document.getElementById("llmBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const status = document.getElementById("status");
    status.textContent = "getting in touch with the assistant";


    try {
        // Run only HTML parsing in the tab 
        const [{ result }] = await chrome.scripting.executeScript({ // inject the script into page and CAN ACCESS IT (no need for eventlisteners)
            target: { tabId: tab.id },
            function: async () => {
                const parser = await import(chrome.runtime.getURL("../assistant/htmlparser.js"));
                const summary = parser.extractPageSummary?.()
                console.log("summary:", summary)
                return summary; // Example short summary
            }
        });

        console.log("above result:", result);

        //Now run the LLM from the popup context
        const { getCompletion } = await import(chrome.runtime.getURL("../assistant/openrouter.js"));
        const llmResp = await getCompletion(result);

        console.log("LLM says:", llmResp);
        status.textContent = llmResp;
    }
    catch (err) {
        console.error("Error:", err);
        status.textContent = "Failed to assist.";
    }

});


//for logs - INSPECT POPUP
