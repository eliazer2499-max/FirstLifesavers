/* =====================================================================
   FIRST LIFESAVERS: SITE SETTINGS  <-- EDIT ONLY THESE LINES
   ---------------------------------------------------------------------
   phoneNumber:    your number, digits only (country code first, no "+",
                   spaces or dashes). Used for the Call and Text (SMS)
                   buttons. Example: (718) 555-0123 -> "17185550123"
   whatsappNumber: your WhatsApp number, same format. Usually the same.
   email:          the email address booking requests should go to.
   To change your number or email later: open script.js on GitHub,
   click the pencil, change the text between the quotes, Commit.
   Any button whose setting is empty or still says YOUR_... is hidden.
   ===================================================================== */
const SITE_CONFIG = {
  phoneNumber: "YOUR_PHONE_NUMBER",
  whatsappNumber: "YOUR_WHATSAPP_NUMBER",
  email: "YOUR_EMAIL@example.com",
  businessName: "First LifeSavers"
};

/* ------------------------- message building ------------------------- */
function cleanNumber(n) {
  const digits = String(n || "").replace(/[\s()+\-.]/g, "");
  return /^\d{7,15}$/.test(digits) ? digits : "";
}
function cleanEmail(e) {
  const v = String(e || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /example\.com$/i.test(v) || /^YOUR_/i.test(v)) return "";
  return v;
}
function isConfigured(cfg) {
  return { phone: !!cleanNumber(cfg.phoneNumber), whatsapp: !!cleanNumber(cfg.whatsappNumber), email: !!cleanEmail(cfg.email) };
}
function buildSmsLink(cfg, text) {
  const num = cleanNumber(cfg.phoneNumber);
  return "sms:+" + num + (text ? "?&body=" + encodeURIComponent(text) : "");
}
function displayNumber(n) {
  const d = cleanNumber(n);
  if (/^1\d{10}$/.test(d)) return "(" + d.slice(1,4) + ") " + d.slice(4,7) + "-" + d.slice(7);
  if (/^\d{10}$/.test(d)) return "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
  return "+" + d;
}
function buildTelLink(cfg) {
  return "tel:+" + cleanNumber(cfg.phoneNumber);
}
function buildMessage(d) {
  const lines = [
    "Hello " + SITE_CONFIG.businessName + ",",
    "",
    "I'd like to book a class.",
    "",
    "Name: " + (d.name || "").trim(),
    "Course: " + d.course,
    "Class for: " + d.classFor,
    "Language: " + d.language,
    "Who is joining: " + d.group,
    "Where: " + d.where
  ];
  if (d.when && d.when.trim()) lines.push("Preferred dates/times: " + d.when.trim());
  if (d.notes && d.notes.trim()) lines.push("", "Notes: " + d.notes.trim());
  lines.push("", "Please send me the schedule and pricing. Thank you!");
  return lines.join("\n");
}
function buildWhatsAppLink(cfg, text) {
  const num = cleanNumber(cfg.whatsappNumber);
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
}
function buildMailtoLink(cfg, data, text) {
  const to = cleanEmail(cfg.email);
  const subject = "Class booking request: " + data.course + " (" + data.classFor + ")";
  return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
}

/* ------------------------------ Yiddish ------------------------------ */
const I18N = {
  yi: {
    navCourses: "קורסן",
    navWhy: "פארוואס אונז",
    navWho: "פאר וועמען",
    navFaq: "פראגעס",
    navBook: "באשטעלט א קלאס",
    heroTitle: "ביז די הילף קומט אן, זענען די ערשטע מינוטן אין אייערע הענט.",
    heroSub: "קורסן אין ערשטע הילף, CPR און BLS, אויף אידיש אדער ענגליש, ביי אייך אין ארט.",
    ctaCertified: "ווערט סערטיפיצירט",
    ctaFilm: "זעט דעם פילם",
    coursesTitle: "סערטיפיצירטע קורסן",
    filmTitle: "נישטא קיין צייט צו טראכטן.",
    whyTitle: "פארוואס First LifeSavers",
    whoTitle: "פאר יעדן וואס קען זיין דער ערשטער ביים פלאץ",
    howTitle: "דריי פשוטע טריט",
    faqTitle: "פראגעס און תשובות",
    bookTitle: "באשטעלט א קלאס"
  }
};

/* ------------------------------ page code ----------------------------- */
if (typeof document !== "undefined") {
  document.documentElement.classList.remove("no-js");
  document.addEventListener("DOMContentLoaded", function () {
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* year */
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    /* header */
    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const menuBtn = $("#menu-btn");
    const closeMenu = () => { header.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
    menuBtn.addEventListener("click", () => {
      const open = !header.classList.contains("open");
      header.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("#site-nav a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

    /* hero video: tall on phones, wide elsewhere */
    const hv = $("#hero-video");
    if (hv) {
      const tall = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
      hv.poster = tall ? hv.dataset.posterTall : hv.dataset.posterWide;
      const saveData = navigator.connection && navigator.connection.saveData;
      if (!reduceMotion && !saveData) {
        hv.src = tall ? hv.dataset.tall : hv.dataset.wide;
        hv.preload = "auto";
        const p = hv.play(); if (p && p.catch) p.catch(() => {});
      }
    }

    /* reveal on scroll */
    const items = $$(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      items.forEach(el => io.observe(el));
    } else items.forEach(el => el.classList.add("in"));

    /* language toggle (headings and buttons) */
    const toggle = $("#lang-toggle");
    const els = $$("[data-i18n]");
    els.forEach(el => { el.dataset.en = el.textContent; });
    function setLang(lang) {
      const yi = lang === "yi";
      document.body.classList.toggle("lang-yi", yi);
      els.forEach(el => {
        const k = el.dataset.i18n;
        if (yi && I18N.yi[k]) { el.textContent = I18N.yi[k]; el.lang = "yi"; el.dir = "rtl"; }
        else { el.textContent = el.dataset.en; el.removeAttribute("lang"); el.removeAttribute("dir"); }
      });
      toggle.textContent = yi ? "English" : "אידיש";
      toggle.lang = yi ? "en" : "yi";
      toggle.setAttribute("aria-label", yi ? "Switch headings to English" : "Switch headings to Yiddish");
      try { localStorage.setItem("fls-lang", lang); } catch (e) {}
    }
    toggle.addEventListener("click", () => setLang(document.body.classList.contains("lang-yi") ? "en" : "yi"));
    try { if (localStorage.getItem("fls-lang") === "yi") setLang("yi"); } catch (e) {}

    /* course links preselect the form */
    const form = $("#book-form");
    const courseSel = $("#f-course");
    $$("[data-course]").forEach(a => a.addEventListener("click", () => { courseSel.value = a.dataset.course; }));

    /* booking form */
    const ready = $("#ready"), readyText = $("#ready-text"), wa = $("#wa-link"), mail = $("#mail-link"), copyBtn = $("#copy-btn");
    const conf = isConfigured(SITE_CONFIG);
    if (!conf.whatsapp || !conf.email || !conf.phone) {
      console.info("[First LifeSavers] Fill in SITE_CONFIG at the top of script.js.");
    }
    const sms = $("#sms-link"), call = $("#call-link");
    /* contact buttons: shown only for settings that are filled in */
    const bar = $("#contact-bar");
    if (bar) {
      const show = (id, on) => { const el = $(id); if (el) el.hidden = !on; };
      if (conf.phone) {
        const t = $("#cl-tel"); t.href = buildTelLink(SITE_CONFIG); t.textContent = displayNumber(SITE_CONFIG.phoneNumber);
        $("#cl-sms").href = buildSmsLink(SITE_CONFIG, "");
      }
      if (conf.whatsapp) {
        const w = $("#cl-wa-a"); w.href = "https://wa.me/" + cleanNumber(SITE_CONFIG.whatsappNumber); w.textContent = displayNumber(SITE_CONFIG.whatsappNumber);
      }
      if (conf.email) {
        const m = $("#cl-mail-a"); const em = cleanEmail(SITE_CONFIG.email); m.href = "mailto:" + em; m.textContent = em;
      }
      show("#cl-phone", conf.phone); show("#cl-wa", conf.whatsapp); show("#cl-mail", conf.email);
      bar.hidden = !(conf.phone || conf.whatsapp || conf.email);
    }
    if (sms) sms.hidden = !conf.phone;
    if (call) { call.hidden = !conf.phone; if (conf.phone) call.href = buildTelLink(SITE_CONFIG); }
    function check(id, ok) {
      const f = $("#f-" + id), e = $("#err-" + id);
      f.classList.toggle("invalid", !ok); f.setAttribute("aria-invalid", String(!ok)); e.hidden = ok;
      return ok;
    }
    form.addEventListener("submit", ev => {
      ev.preventDefault();
      const fd = new FormData(form);
      const d = Object.fromEntries(fd.entries());
      const ok = [check("name", !!(d.name || "").trim()), check("course", !!d.course)].every(Boolean);
      if (!ok) { (form.querySelector(".invalid") || form).focus(); return; }
      const text = buildMessage(d);
      readyText.textContent = text;
      wa.href = buildWhatsAppLink(SITE_CONFIG, text);
      mail.href = buildMailtoLink(SITE_CONFIG, d, text);
      if (sms && conf.phone) sms.href = buildSmsLink(SITE_CONFIG, text);
      ready.hidden = false;
      ready.focus({ preventScroll: true });
      ready.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    copyBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(readyText.textContent); copyBtn.textContent = "Copied!"; }
      catch (e) { copyBtn.textContent = "Select & copy above"; }
      setTimeout(() => { copyBtn.textContent = "Copy text"; }, 2200);
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SITE_CONFIG, cleanNumber, cleanEmail, isConfigured, buildMessage, buildWhatsAppLink, buildMailtoLink, buildSmsLink, buildTelLink, displayNumber, I18N };
}
