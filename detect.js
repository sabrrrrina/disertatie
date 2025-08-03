// Service worker

console.log("Service worker loaded.");

// Listen for when a tab is updated (e.g. a new page loads)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    const urlObj = new URL(tab.url);
    const hostname = urlObj.hostname;
    const domain = hostname.replace(/^www\./, "")
    console.log("domain", domain)

    const cache = await chrome.storage.local.get();
    const handled = cache.handled || [];
    const whitelist = cache.whitelist || [];
    const fallback = cache.fallback || []; //this is just for stats, action takes place each time page is visited

    console.log("handled:", handled, "whitelist:", whitelist, "fallback:", fallback)

    if (handled.includes(domain) || whitelist.includes(domain)) { //la fallback I have to take the action each time
        console.log("Domain handled or whitelisted", domain);
        return;
    }

    // Only run if the tab has finished loading and is a regular web page
    if (changeInfo.status === 'complete' && tab?.url.startsWith('http')) {


        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.type === "getLanguage") {
                const tabId = sender.tab?.id;
                if (domain == "ro.shein.com") {
                    sendResponse({ language: "ro" });
                }
                if (!tabId) {
                    sendResponse({ language: null });
                    return;
                }
                chrome.tabs.detectLanguage(tabId, function (lgResp) {
                    sendResponse({ language: lgResp });
                });
                return true; //keeps the message channel open for async response
            }

            //handle storage
            if (message.type === "addToStorage") {
                handled.push(domain)
                chrome.storage.local.set({ "handled": handled }).then(() => {
                    console.log(`host ${domain} added to storage`);
                });
            }
            if (message.type === "addToFallback") {
                fallback.push(domain)
                chrome.storage.local.set({ "fallback": fallback }).then(() => {
                    console.log(`host ${domain} added to fallback`);
                });
            }
        });


        try {
            // Inject the content script into the active tab
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: async function () {
                    // chrome.runtime.getURL for getting the correct path to your extension file
                    const content = await import(chrome.runtime.getURL("./content.js")); // load content.js as a module // cred ca se poate mai simplu tho
                    if (content.run) {
                        content.run();
                    }
                    else {
                        console.warn("[CS] content.js loaded but no 'run' function exported.");
                    }
                }
            });

            console.log(`Content script injected into tab`);
        }
        catch (error) {
            console.error(`Failed to inject content script into tab ${tabId}:`, error);
        }
    }
});

/*storage/cache: { wl: [dom1, dom2, ...], handled: [dom3, dom4, etc..], fallback: [dom5] } */