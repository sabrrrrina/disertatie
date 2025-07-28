// Service worker

console.log("Service worker loaded.");

// Listen for when a tab is updated (e.g., a new page loads)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    const urlObj = new URL(tab.url);
    const hostname = urlObj.hostname;
    const domain = hostname.replace(/^www\./, "")
    console.log("domain", domain)

    const cache = await chrome.storage.local.get();
    const handled = cache.handled || [];
    const whitelist = cache.whitelist || [];
    console.log("handled:", handled, "whitelist:", whitelist)
    if (handled.includes(domain) || whitelist.includes(domain)) {
        console.log("Domain handled or whitelisted", domain);
        return;
    }

    // Only run if the tab has finished loading and is a regular web page
    if (changeInfo.status === 'complete' && tab?.url.startsWith('http')) {


        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) { //just do a tld bro
            if (message.type === "getLanguage") {
                const tabId = sender.tab?.id;
                if (!tabId) {
                    sendResponse({ language: null });
                    return;
                }
                chrome.tabs.detectLanguage(tabId, function (lgResp) {
                    sendResponse({ language: lgResp });
                });
                return true; //keeps the message channel open for async response
            }
        });


        try {
            // Inject the content script into the active tab
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: async function (domainArg, handledArg) {
                    console.log("Inside injected script. Domain:", domainArg);
                    // chrome.runtime.getURL for getting the correct path to your extension file
                    const content = await import(chrome.runtime.getURL("./content.js")); // load content.js as a module // cred ca se poate mai simplu tho
                    if (content.run) {

                        handledArg.push(domainArg)
                        await chrome.storage.local.set({ "handled": handledArg })

                        content.run();
                    }
                    else {
                        console.warn("[CS] content.js loaded but no 'run' function exported.");
                    }
                }, args: [domain, handled]
            });
            console.log(`Content script injected into tab ${tabId} and host ${domain} added to storage`);
        }
        catch (error) {
            console.error(`Failed to inject content script into tab ${tabId}:`, error);
        }
    }
});

/*wl: [dom1, dom2, ...], handled: [dom3, dom4, etc..] */
