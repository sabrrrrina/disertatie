const keywordsByLang = {
    en: ["reject", "refuse", "decline", "deny", "necessary", "essential", "continue without agreeing", "disagree and close", "continue without accepting", "no, thank you"],
    fr: ["refuser", "décliner", "refus", "essentiel", "poursuivre sans accepter"],
    de: ["ablehnen", "verweigern", "notwendig", "fortfahren ohne zu akzeptieren"],
    es: ["rechazar", "denegar", "necesario", "continuar sin aceptar"],
    ro: ["respinge", "refuză", "necesar", "esențial", "continuă fără a accepta", "nu, mulțumesc"]
};


function findRejectButton(language) {

    console.log("generic btn lg:", language)

    const allButtons = Array.from(document.querySelectorAll(`button, [role="button"]`)); //array.from: NodeList -> Array

    let rejectKeywords = keywordsByLang['en'] //default
    if (language != 'en' && keywordsByLang[language]) {
        rejectKeywords = rejectKeywords.concat(keywordsByLang[language]) //lipesc cuvinte din limba detectata pt cazurile in care bannerul e in engleza regardless
    }

    for (const button of allButtons) {
        const text = button.textContent?.trim().toLowerCase();
        if (!text) continue;

        for (const keyword of rejectKeywords) {
            if (text.includes(keyword)) {
                console.log("Found a potential reject button:", button, allButtons.indexOf(button));
                return button;
            }
        }
    }

    console.log("No reject button found.");
    return false;
}

export function genericHandler(language) {
    const button = findRejectButton(language);
    if (button) {
        button.click();
        console.log("Clicked reject button.");
        return true;
    } else {
        console.log("No button clicked.");
        return false;
    }
}