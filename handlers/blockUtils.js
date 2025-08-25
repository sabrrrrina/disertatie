const keywordMap = {
    violence: [
        "kill", "murder", "shoot", "stab", "attack", "assault", "gun", "bomb",
        "explosion", "terror", "massacre", "slaughter", "blood", "dead body",
        "execution", "torture", "rape", "homicide", "war", "combat", "beheading", "trump", "putin"
    ],
    hate: [
        "racist", "bigot", "slur", "homophobic", "xenophobic", "misogynist",
        "hate crime", "white supremacy", "nazis", "antisemitic", "lynch", "genocide",
        "discrimination", "abuse", "harassment", "bullying", "hate speech", "extremism", "hate"
    ],
    gambling: [
        "casino", "bet", "wager", "roulette", "blackjack", "slots", "poker",
        "jackpot", "bingo", "sports betting", "lottery", "bookmaker", "dice",
        "gamble", "parlay", "spread betting", "odds", "racing", "betting site"
    ],
    drugs: [
        "cocaine", "heroin", "weed", "marijuana", "cannabis", "hash", "opium",
        "meth", "ecstasy", "LSD", "psychedelic", "shrooms", "ketamine", "crack",
        "drug dealing", "overdose", "pill", "painkiller", "oxycontin", "fentanyl",
        "alcohol", "vodka", "whiskey", "beer", "wine", "liquor", "tequila"
    ],
    diet: [
        "weight loss", "slim fast", "low carb", "no carb", "diet pill",
        "calorie deficit", "fasting", "keto", "paleo", "atkins", "south beach",
        "detox", "cleanse", "appetite suppressant",
        "lose belly fat", "skinny tea", "waist trainer", "fad diet",
        "burn fat", "get thin", "weight watchers", "fat loss", "weight loss", "meal plan", "diet", "dieta"
    ]
};



export function blurElement(el, category) {

    if (!el || el.dataset.blocked) return; // avoid double-blocking
    el.dataset.blocked = "true";

    // Wrap the element so overlay can sit on top
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = el.offsetWidth + "px";
    wrapper.style.height = el.offsetHeight + "px";

    // Apply blur to the original element
    el.style.filter = "blur(6px)";
    el.title = "Blocked by extension (click to reveal)";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.textContent = `🚫 Blocked: ${category}`;
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
    overlay.style.color = "white";
    overlay.style.fontSize = "14px";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.textAlign = "center";
    overlay.style.zIndex = 9999;

    // Insert wrapper in DOM, move element inside
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    wrapper.appendChild(overlay);

    // Allow user to click overlay to reveal
    overlay.addEventListener("click", () => {
        el.style.filter = "none";       // remove blur
        overlay.remove();              // remove overlay
        delete el.dataset.blocked;     // allow re-blocking if needed
    });
}

//keyword based

export function blockByKeywords(selected) {
    const activeKeywords = [];
    const keywordToCategory = {};

    // collect enabled keywords + map them back to their categories
    for (const [category, enabled] of Object.entries(selected)) {
        if (enabled) {
            for (const kw of keywordMap[category]) {
                activeKeywords.push(kw);
                keywordToCategory[kw.toLowerCase()] = category;
            }
        }
    }

    if (!activeKeywords.length) return;

    // regex with word boundaries, case-insensitive
    const regex = new RegExp(`(^|\\W)(${activeKeywords.join("|")})(?=$|\\W)`, "i");

    function processTextNode(node) {
        const match = node.textContent.match(regex);
        if (match) {
            const keyword = match[2].toLowerCase();
            const category = keywordToCategory[keyword] || "";

            // find the smallest reasonable parent to blur
            let el = node.parentElement;
            if (el) {
                // avoid blurring large containers (article, section, etc.)
                while (el.parentElement &&
                    el.textContent.trim().length < el.parentElement.textContent.trim().length &&
                    el.parentElement !== document.body &&
                    !["ARTICLE", "SECTION"].includes(el.tagName)) {
                    el = el.parentElement;
                }
                blurElement(el, category);
            }
        }
    }

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // skip obvious layout elements
            if (!["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.tagName)) {
                for (let child of node.childNodes) {
                    walk(child);
                }
            }
        }
    }

    walk(document.body);
}
