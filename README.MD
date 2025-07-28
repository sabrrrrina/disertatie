# CookieHandler Extension

A Chrome extension that automatically rejects non-essential cookies on websites, helping users minimize tracking and maintain privacy.

## Features

- Automatically detects and clicks cookie rejection buttons using keyword matching.
- Works on a variety of banner formats and layouts.
- Detects page language dynamically to improve banner handling accuracy.
- Allows users to whitelist websites, preventing automatic cookie rejection on those domains.

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the the entire directory.

You can "Add to Whitelist" to exclude a site from handling, and "Edit Whitelist" to manually view or modify domains (one per line). Use "Delete All Cookie Settings" to remove all cookies and reset the whitelist. If a cookie banner loads late, click "Try Again" to re-run the rejection logic (for example on `testim.io`). If a domain is whitelisted, the cookie banner is not handled in any way, leaving the user to tackle it as usual.


## Tested websites

### using onetrust 
onetrust.com
netflix.com
discord.com
spotify.com
stackoverflow.com
rottentomatoes.com
smithsonianmag.com
reuters.com
avast.com
pewresearch.org
shutterstock.com
tokiohotel.com
leroymerlin.fr

### using cookiebot
cookiebot.com
azlyrics.com
gisela.com
farmaciatei.ro

### cookieyes
realtree.com
rarediseases.org
psychologytoday.com

### generic
imdb.com
meshsecurity.io
hostinger.com
facebook.com
instagram.com
w3resource.com
smithsonianmag.com
artigianipizzeria.ro
dedeman.ro

### special cases
reddit.com
flixbus.com

