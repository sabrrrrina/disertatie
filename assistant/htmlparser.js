export function extractPageSummary(maxLength = 5000) {
    function getVisibleText(el) {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return "";
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) return "";
        let text = "";
        for (let child of el.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent.trim() + " ";
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                text += getVisibleText(child);
            }
        }
        return text;
    }

    const title = document.title || "";
    const headings = Array.from(document.querySelectorAll("h1, h2"))
        .map(h => h.innerText.trim())
        .filter(Boolean)
        .join("\n");

    let bodyText = getVisibleText(document.body).replace(/\s+/g, " ").trim();
    if (bodyText.length > maxLength) {
        bodyText = bodyText.slice(0, maxLength) + "...[truncated]";
    }

    return `
[Page Title]
${title}

[Headings]
${headings}

[Visible Text Sample]
${bodyText}
  `.trim();
}


//The result returned from executeScript is passed through the extension messaging layer. Chrome can handle large strings, but if you try to send multi-megabyte results, it might throw. maxLength keeps it safe.
