export function detectBanner() {
    const rgx = /(cookie(s)?( settings)?|use(s)? cookies|privacy policy|your personal data will be processed|prelucrăm datele|setări de confidențialitate)/i;

    const candidates = Array.from(document.querySelectorAll('div[role="dialog"], div, section, aside'));

    for (const el of candidates) {

        const text = el.innerText.toLowerCase();

        if (!text.match(rgx)) {
            continue; // skip if no keyword match
        }

        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Filter: must be visible
        if (style.display === 'none' || style.visibility === 'hidden') continue;

        // Filter: banners often fixed or absolute
        if (!(style.position === 'fixed' || style.position === 'absolute')) continue;

        // Filter: must be of reasonable size (avoid small footer links)
        if (rect.height < 50 || rect.width < 200) continue;

        // Filter: must be near top or bottom
        const nearTop = rect.top < window.innerHeight * 0.25;
        const nearBottom = rect.bottom > window.innerHeight * 0.75;
        if (!nearTop && !nearBottom) continue;

        console.log("🍪 Possible banner found:", el);
        return el;
    }

    return null;
}


export function removeBanner(element) {
    if (!element) return;

    let current = element;
    while (current.parentElement && current.parentElement.tagName.toLowerCase() !== "body") {
        current = current.parentElement;
    }

    console.log("Removing banner:", current);
    current.remove();
}
