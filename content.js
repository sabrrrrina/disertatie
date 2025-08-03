import { oneTrustHandler, cookiebotHandler, cookieyesHandler } from "./handlers/knownProviders.js";
import { redditHandler, flixbusHandler } from "./handlers/edgeCases.js";
import { genericHandler } from "./handlers/generic.js";
import { detectBanner, removeBanner } from "./handlers/fallback.js";


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

        var lang = "";

        if (response?.language) {
            lang = response.language;
            console.log("Language received:", lang);
        }

        else {
            console.error("Failed to get language from background");
            lang = 'en'
        }

        console.log("Checking for cookie banners on:", document.location.href);

        setTimeout(function () { //the magic happens

            let result = detectHandlerType(lang);

            if (result) {

                chrome.runtime.sendMessage({
                    type: "addToStorage", function(res) { console.log("ok button") } //don't wait for answer
                })
                console.log("success")
            }
            else { //fallback

                const banner = detectBanner()
                if (banner) {
                    removeBanner(banner);
                    chrome.runtime.sendMessage({
                        type: "addToFallback", function(res) { console.log("ok banner") }
                    })
                }
                else {
                    console.log("nothing happened on this page")
                }

            }
        }, 500); // delay execution so banner is rendered
    });
}



console.log("Service worker loaded successfully!");