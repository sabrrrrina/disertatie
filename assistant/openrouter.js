const API_KEY = "";
const MODEL = "mistralai/mistral-7b-instruct:free";

const content_message = `You are an assistant that analyzes website content with a focus on cookies and privacy.

You will be given visible text from a webpage (HTML already parsed, banners not explicitly extracted).

From this text, provide:
1. A short, clear summary of what the page is about.
2. A short note on the site's likely purpose (e.g., news, social media, e-commerce, corporate site).
3. An opinion on whether it is generally safe to accept cookies here, considering the site's purpose and content. Be firm about it and not too broad.

Keep each answer concise. Avoid overexplaining. Use plain language.
`
const user_message = `Here is the page text:`


export async function getCompletion(text) {

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content: content_message
                },
                {
                    role: "user",
                    content: user_message + text
                }
            ]
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 4))
    return data.choices[0].message.content
}



/*response: Here's something encouraging for the student: (using mistralai/mistral-small-3.1-24b-instruct:free)

  "I've heard that the final push is often the hardest, but it's also the closest to the finish line. You've made it this far, and that's a huge accomplishment. Remember that you've tackled challenging tasks before and succeeded. Break down your work into smaller, manageable parts and focus on one section at a time. It's normal to feel stressed, but try to take short breaks to recharge. Most importantly, believe in your ability to complete this; you're stronger and more capable than you might feel right now. You're almost there, and finishing your dissertation will be a tremendous achievement to be proud of!"*/
