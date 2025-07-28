export function redditHandler() {
    const redditBanner = document.querySelector('reddit-cookie-banner');

    const redditShadow = redditBanner?.shadowRoot;

    // const dialog = redditShadow?.querySelector('#cookie-banner-dialog'); //sau 'faceplate-dialog'
    // const targetBtn = dialog.querySelector('#reject-nonessential-cookies-button')

    const allButtons = redditShadow.querySelectorAll('button') //const allButtons = targetBtn.querySelectorAll('button')

    const rejectBtn = Array.from(allButtons).find(btn =>
        btn.textContent?.toLowerCase().includes("reject")
    );

    rejectBtn?.click();
    return true;
}

export function flixbusHandler() {

    const flixbusDiv = document.querySelector('#usercentrics-root')

    const flixbusShadow = flixbusDiv?.shadowRoot;

    const allButtons = flixbusShadow.querySelectorAll('button')

    const rejectBtn = Array.from(allButtons).find(btn =>
        btn.textContent?.toLowerCase().match("deny|refuzați")
    );

    rejectBtn?.click();
    return true;
}