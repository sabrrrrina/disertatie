
// This function gets serialized & runs inside the tab
export async function injectBlocker(mode, blockArg) {

    try {
        const { blurElement, blockByKeywords } = await import(chrome.runtime.getURL("../block/blockUtils.js"));

        if (mode === "keywords") {
            console.log("hello keywords");
            blockByKeywords(blockArg);
        }

        if (mode === "ai") {
            console.log("hello ai");
            const { collectPageSnippets } = await import(chrome.runtime.getURL("../assistant/htmlparser.js"));
            const { getAIblock } = await import(chrome.runtime.getURL("../assistant/openrouter.js"));

            const snippets = collectPageSnippets();
            const response = await getAIblock(snippets);

            let results;
            try {
                results = JSON.parse(response);
            }
            catch (e) {
                return console.error("Bad AI JSON:", response);
            }

            for (let r of results) {
                const matchingCategories = r.categories.filter(cat => blockArg[cat]);
                if (matchingCategories.length > 0) {
                    const el = document.evaluate(r.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (el) {
                        blurElement(el, matchingCategories.join(", "));
                    }
                }
            }
        }

    } catch (ex) {
        console.log("ce plm", ex)
    }

}
