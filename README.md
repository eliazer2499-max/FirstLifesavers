# First LifeSavers website

A fast, static website (plain HTML, CSS and JavaScript). No server, no build step.

## Your contact details

They are already filled in at the very top of `script.js`:

```js
phoneNumber: "(646) 626-4996",
whatsappNumber: "(646) 626-4996",
email: "firstlifesavers@gmail.com",
```

To change them, edit those three lines. They fill in the "Reach us directly" box
(the number and the email address; tapping the number opens Call / Text / WhatsApp, tapping the email opens email),
the footer, and the buttons under the booking form. The booking form builds a ready-made message and opens WhatsApp,
Messages (text) or the visitor's email app. Nothing is sent from the website itself.

## English / Yiddish

The אידיש / English button switches the whole page (right-to-left in Yiddish)
and remembers the choice. Every wording lives in `script.js` under `I18N`:
`en` for English, `yi` for Yiddish. To change a wording, change it there.

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
- `script.js` – settings, booking form, contact pop-up, all English and Yiddish wording
- `assets/` – logo, photos, videos and fonts (all local, total about 8 MB)
