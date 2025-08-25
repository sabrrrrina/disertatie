// page assistant helper:

function getVisibleText(el) {

    const style = window.getComputedStyle(el); //gets the computed CSS styles for the current element (not just inline styles)

    // collects only visible text
    if (style.display === "none" || style.visibility === "hidden") {
        return "";
    }
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) {
        return "";
    }

    let text = "";
    for (let child of el.childNodes) { //loops through all child nodes
        if (child.nodeType === Node.TEXT_NODE) { //if the child is a text node, append its text (trimmed) to text
            text += child.textContent.trim() + " ";
        }
        else if (child.nodeType === Node.ELEMENT_NODE) { //if the child is an element node, recurse into it with getVisibleTex
            text += getVisibleText(child);
        }
    }
    return text;
}

export function extractPageSummary(maxLength = 5000) {

    const title = document.title || "";
    const headings = Array.from(document.querySelectorAll("h1, h2"))
        .map(h => h.innerText.trim())
        .filter(Boolean) //creates a new array that includes only truthy values (fara null undefined 0)
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


// content blocking feature:

// helper to re-find the element later
function getXPath(element) {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }
    return element.parentNode
        ? getXPath(element.parentNode) + '/' + element.tagName.toLowerCase()
        : element.tagName.toLowerCase();
}

export function collectPageSnippets(limit = 20) {
    const elements = Array.from(document.querySelectorAll("h1, h2, h3, p, article, figcaption"));
    const snippets = [];

    for (let el of elements) {
        const text = (el.innerText || el.alt || "").trim();
        if (text.length > 20) { // skip tiny bits
            snippets.push({ text, xpath: getXPath(el) });
        }
        if (snippets.length >= limit) {
            break;
        } // keep it manageable
    }
    console.log("snippets:", snippets)
    return snippets;
}