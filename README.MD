# CookieHandler Extension

A Chrome extension that enhances privacy and control while browsing the web.  
It automatically rejects non-essential cookies, allows fine-grained blocking of unwanted content, and integrates with AI for page analysis and recommendations.

## Features

### 🍪 Cookie Management
- Automatically detects and rejects non-essential cookies.
- Handles banners from major frameworks (OneTrust, Cookiebot, CookieYes, and more).
- Dynamically detects page language to improve banner handling.
- Whitelist websites to prevent automatic handling (e.g., when you want to manage cookies manually).
- Quick actions:
  - **Add to Whitelist** → Exclude a site from handling.
  - **Edit Whitelist** → Manually view or modify domains (one per line).
  - **Delete All Cookie Settings** → Remove cookies and reset whitelist.
  - **Try Again** → Re-run banner rejection logic (useful for late-loading banners).

### 🛑 Content Blocking
- **Keyword-based blocking** → Blur elements containing user-selected categories (e.g., *violence*, *diet*, *drugs*, etc.).
- **AI-based blocking** → Uses a language model to scan page content and block elements by semantic categories, not just keywords.
- Unified blocking overlay → Blurs blocked elements and displays a warning (`🚫 Blocked: <category>`).

### 🤖 Page Assistant
- Button that analyzes the current page using a Large Language Model.
- Provides human-readable **summaries, insights, and cookie-setting recommendations** for that page.

### 🐞 Debugging
- **Debug button** sends a report to a local server whenever the extension fails to handle a page, helping improve detection rules.

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project directory.

## Usage Notes

- If a domain is whitelisted, the cookie banner is not handled at all.
- Blurring behavior can be switched between **keyword mode** and **AI mode** in the popup.
- Click any blurred/blocked element to reveal it (if you want to override the block).

## Tested Websites

### Using OneTrust
- onetrust.com
- netflix.com
- discord.com
- spotify.com
- stackoverflow.com
- rottentomatoes.com
- smithsonianmag.com
- reuters.com
- avast.com
- pewresearch.org
- shutterstock.com
- tokiohotel.com
- leroymerlin.fr

### Using Cookiebot
- cookiebot.com
- azlyrics.com
- gisela.com
- farmaciatei.ro

### Using CookieYes
- realtree.com
- rarediseases.org
- psychologytoday.com

### Generic Banners
- imdb.com
- meshsecurity.io
- hostinger.com
- facebook.com
- instagram.com
- w3resource.com
- smithsonianmag.com
- artigianipizzeria.ro
- dedeman.ro

### Special Cases
- reddit.com
- flixbus.com
