chrome.storage.local.get(["handled", "whitelist"], ({ handled = [], whitelist = [] }) => {
    const cookiesRejected = handled.length;
    const whitelistedSites = whitelist.length;

    document.getElementById("summaryText").textContent =
        `You have rejected ${cookiesRejected} cookie banners and whitelisted ${whitelistedSites} sites.`;

    // Max value for scaling
    const maxValue = Math.max(cookiesRejected, whitelistedSites, 1); // avoid division by zero
    const maxHeight = 200; // pixels

    // Calculate proportional heights
    const cookiesHeight = (cookiesRejected / maxValue) * maxHeight;
    const whitelistHeight = (whitelistedSites / maxValue) * maxHeight;

    // Apply heights
    document.getElementById("cookiesBar").style.height = `${cookiesHeight}px`;
    document.getElementById("cookiesLabel").textContent = `Banners rejected (${cookiesRejected})`;

    document.getElementById("whitelistBar").style.height = `${whitelistHeight}px`;
    document.getElementById("whitelistLabel").textContent = `Whitelisted sites (${whitelistedSites})`;
});
