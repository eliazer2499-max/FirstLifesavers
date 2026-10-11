# First LifeSavers website

A fast, static website (plain HTML, CSS and JavaScript). No server, no build step.

## Before you publish: add your contact details

Open `script.js` and edit the two lines at the very top:

```js
whatsappNumber: "YOUR_WHATSAPP_NUMBER",   // digits only, e.g. "17185550123"
email: "YOUR_EMAIL@example.com",          // where booking requests go
```

The booking form builds a ready-made message and opens WhatsApp (wa.me) or the
visitor's email app. Nothing is sent from the website itself.

## Publish free on GitHub Pages

1. Sign in at github.com and click **New repository**. Give it a name (for example `first-lifesavers`), set it to **Public**, and create it.
2. Click **uploading an existing file**, drag in **everything from this folder** (index.html, styles.css, script.js, the `assets` folder, `.nojekyll`, `og.jpg`, this README), and click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait a minute or two. Your site will be live at `https://YOUR-USERNAME.github.io/first-lifesavers/`.
5. Optional: once you buy a domain, add it under **Settings → Pages → Custom domain**.

Tip: on a Mac, files starting with a dot (like `.nojekyll`) are hidden. Press Cmd+Shift+. in Finder to see it. The site still works without it.

## Files

- `index.html` – the page
- `styles.css` – design (brand red #D3213A, navy #182945, Montserrat)
- `script.js` – settings, booking form, Yiddish/English headings toggle
- `assets/` – logo, photos, videos and fonts (all local, total about 8 MB)
- `tests/` – an automated check (run `node --test` in this folder), not needed for hosting
