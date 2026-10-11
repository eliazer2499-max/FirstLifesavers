// Checks the real site files: run with `node --test` from the repo root or the project folder.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const candidates = [path.join(__dirname, "..", "site"), path.join(__dirname, "..")];
const ROOT = candidates.find(p => fs.existsSync(path.join(p, "index.html")));
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const lib = require(path.join(ROOT, "script.js"));

test("title, viewport and landmarks", () => {
  assert.match(html, /<title>First LifeSavers[^<]+<\/title>/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1/);
  for (const tag of ["<header", "<main", "<footer", "<nav"]) assert.ok(html.includes(tag), tag);
  assert.strictEqual((html.match(/<h1[\s>]/g) || []).length, 1);
});

test("core content is present", () => {
  for (const s of ["Before help arrives, the first minutes are in your hands.", "Get certified", "First Aid", "CPR &amp; AED",
    "BLS for Healthcare Providers", "Contact us for schedule &amp; pricing", "Yiddish &amp; English", "Male &amp; female instructors",
    "shul, school, office or home", "Groups &amp; individuals", "Parents", "Teachers &amp; mosdos", "Camp staff", "Shul members",
    "Businesses", "Healthcare workers", "ונשמרתם מאוד לנפשותיכם"]) assert.ok(html.includes(s), s);
  assert.match(html, /lang="he" dir="rtl">ונשמרתם/);
});

test("nothing invented or off-limits", () => {
  const lower = html.toLowerCase();
  assert.ok(!/\$\s?\d/.test(html), "no prices");
  assert.ok(!/firstlifesavers\.com/.test(lower), "no unowned domain");
  assert.ok(!/hatzolah\.(org|com)|hatzalah\.(org|com)/.test(lower), "no Hatzolah links");
  assert.ok(!/american heart|red cross|\baha\b|testimonial/.test(lower), "no accreditation bodies / testimonials");
  assert.ok(!/lorem|todo|tbd/i.test(html + css), "no placeholder text");
});

test("every local asset exists, no remote assets", () => {
  const refs = [...html.matchAll(/(?:src|href|poster|data-wide|data-tall|data-poster-wide|data-poster-tall)="([^"#][^"]*)"/g)].map(m => m[1])
    .concat([...css.matchAll(/url\("?([^")]+)"?\)/g)].map(m => m[1]));
  assert.ok(refs.length > 10);
  for (const r of refs) {
    if (/^(mailto:|https:\/\/wa\.me)/.test(r)) continue;
    assert.ok(!/^https?:|^\/\//.test(r), "remote asset: " + r);
    assert.ok(!r.startsWith("/"), "absolute path breaks GitHub Pages: " + r);
    assert.ok(fs.existsSync(path.join(ROOT, r)), "missing: " + r);
  }
});

test("site stays light", () => {
  let total = 0;
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : (total += fs.statSync(p).size);
  });
  walk(ROOT);
  assert.ok(total < 12 * 1024 * 1024, "total " + total);
});

test("config is one clearly marked constant with placeholders", () => {
  const js = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
  assert.match(js.slice(0, 1200), /const SITE_CONFIG = \{\s*whatsappNumber: "YOUR_WHATSAPP_NUMBER",\s*email: "YOUR_EMAIL@example\.com"/);
  assert.strictEqual((js.match(/YOUR_WHATSAPP_NUMBER/g) || []).length, 1);
  assert.ok(!html.includes("YOUR_"), "placeholders only live in script.js");
});

test("form builds a correct wa.me link and mailto", () => {
  const data = { name: "Moshe Weiss", course: "CPR & AED", classFor: "Men", language: "Yiddish", group: "A small group (2–10)", where: "Shul", when: "Sunday evenings", notes: "" };
  const text = lib.buildMessage(data);
  assert.match(text, /Course: CPR & AED/);
  const cfg = { whatsappNumber: "+1 (718) 555-0123", email: "info@example.org" };
  const wa = lib.buildWhatsAppLink(cfg, text);
  assert.ok(wa.startsWith("https://wa.me/17185550123?text="), wa);
  assert.strictEqual(decodeURIComponent(wa.split("?text=")[1]), text);
  const unset = lib.buildWhatsAppLink(lib.SITE_CONFIG, text);
  assert.ok(unset.startsWith("https://wa.me/?text="), "placeholder number falls back to contact picker");
  const m = lib.buildMailtoLink(cfg, data, text);
  assert.ok(m.startsWith("mailto:info@example.org?subject=Class%20booking%20request"), m);
  assert.strictEqual(lib.buildMailtoLink(lib.SITE_CONFIG, data, text).slice(0, 8), "mailto:?");
});

test("yiddish strings are Hebrew-script", () => {
  for (const [k, v] of Object.entries(lib.I18N.yi)) assert.match(v, /[\u05D0-\u05EA]/, k);
  const keys = [...html.matchAll(/data-i18n="(\w+)"/g)].map(m => m[1]);
  for (const k of keys) assert.ok(lib.I18N.yi[k], "missing yiddish for " + k);
});
