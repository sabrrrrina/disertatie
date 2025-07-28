import { oneTrustHandler, cookiebotHandler, cookieyesHandler } from "./handlers/knownProviders.js";
import { redditHandler, flixbusHandler } from "./handlers/edgeCases.js";
import { genericHandler } from "./handlers/generic.js";


function detectHandlerType(language) {
    if (document.querySelector("#onetrust-reject-all-handler")) {
        console.log("oneTrust?")
        return oneTrustHandler();
    }
    else if (document.querySelector("#CybotCookiebotDialogBodyButtonDecline")) {
        console.log("cookiebot?")
        return cookiebotHandler();
    }
    else if (document.querySelector(".cky-btn.cky-btn-reject")) {
        console.log("cookieyes?")
        return cookieyesHandler();
    }
    else if (document.querySelector('reddit-cookie-banner')) {
        console.log("reddit?")
        return redditHandler();
    }
    else if (location.hostname.includes("flixbus")) {
        console.log("flixbus?")
        return flixbusHandler();
    }
    else {
        return genericHandler(language);
    }
}



export function run() {

    chrome.runtime.sendMessage({ type: "getLanguage" }, function (response) {

        var tld = new URL(document.location.href).tld

        if (response?.language) {
            const lang = response.language;
            console.log("Language received:", lang);

            console.log("Checking for cookie banners on:", document.location.href);

            setTimeout(function () {
                let result = detectHandlerType(lang);
                if (result) {
                    console.log("success")
                } else {
                    console.log("fail")
                }
            }, 1000); // delay execution so banner is rendered
        }

        else {
            console.error("Failed to get language from background");
        }
    });
}



console.log("Service worker loaded successfully!");