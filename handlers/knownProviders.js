export function oneTrustHandler() {
    const rejectBtn = document.querySelector("#onetrust-reject-all-handler")
    if (rejectBtn) {
        rejectBtn.click();
        console.log("Clicked #onetrust reject button.");
        return true;
    }
    return false;
}


export function cookiebotHandler() {
    const rejectBtn = document.querySelector("#CybotCookiebotDialogBodyButtonDecline")
    if (rejectBtn) {
        rejectBtn.click();
        console.log("Clicked #cookiebot reject button.");
        return true;
    }
    return false;
}


export function cookieyesHandler() {
    const rejectBtn = document.querySelector(".cky-btn.cky-btn-reject")
    if (rejectBtn) {
        rejectBtn.click();
        console.log("Clicked #cookieyes reject button.");
        return true;
    }
    return false;
}
