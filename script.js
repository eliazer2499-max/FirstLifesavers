/* =====================================================================
   FIRST LIFESAVERS: SITE SETTINGS  <-- EDIT ONLY THESE LINES
   ---------------------------------------------------------------------
   phoneNumber:    your phone number, for example "(718) 555-0123".
                   Used for the Call and Text buttons.
   whatsappNumber: your WhatsApp number, same format. Usually the same.
   email:          the email address booking requests should go to.
   To change your number or email later: open script.js on GitHub,
   click the pencil, change the text between the quotes, Commit.
   Any button whose setting is empty or still says YOUR_... is hidden.
   ===================================================================== */
const SITE_CONFIG = {
  phoneNumber: "(718) 555-0123",
  whatsappNumber: "(718) 555-0123",
  email: "info@firstlifesavers.com",
  businessName: "First LifeSavers"
};

/* ------------------------- message building ------------------------- */
function cleanNumber(n) {
  const digits = String(n || "").replace(/[\s()+\-.]/g, "");
  if (/^\d{10}$/.test(digits)) return "1" + digits; /* US number without country code */
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
function displayNumber(n) {
  const d = cleanNumber(n);
  if (/^1\d{10}$/.test(d)) return "(" + d.slice(1,4) + ") " + d.slice(4,7) + "-" + d.slice(7);
  return "+" + d;
}
function buildTelLink(cfg) {
  return "tel:+" + cleanNumber(cfg.phoneNumber);
}
function buildSmsLink(cfg, text) {
  const num = cleanNumber(cfg.phoneNumber);
  return "sms:+" + num + (text ? "?&body=" + encodeURIComponent(text) : "");
}
function buildWhatsAppLink(cfg, text) {
  const num = cleanNumber(cfg.whatsappNumber);
  return "https://wa.me/" + num + (text ? "?text=" + encodeURIComponent(text) : "");
}

/* form values are stored in English; this shows them in the page language */
const VALUE_KEYS = {
  "First Aid": "optFirstAid", "CPR & AED": "optCpr", "BLS for Healthcare Providers": "optBls",
  "Not sure yet, please advise": "optUnsure", "Men": "optMen", "Women": "optWomen",
  "Yiddish": "optYiddish", "English": "optEnglish", "Just me": "optJustMe",
  "A small group (2–10)": "optSmall", "A larger group (10+)": "optLarge", "Shul": "optShul",
  "School / mosad": "optSchool", "Office / business": "optOffice", "Home": "optHome",
  "Camp": "optCamp", "Other / not sure": "optOther"
};
function t(key, lang) {
  const L = I18N[lang] || I18N.en;
  return L[key] != null ? L[key] : I18N.en[key];
}
function tv(value, lang) {
  return VALUE_KEYS[value] ? t(VALUE_KEYS[value], lang) : value;
}
function buildMessage(d, lang) {
  lang = lang === "yi" ? "yi" : "en";
  const row = (k, v) => t(k, lang) + ": " + v;
  const lines = [
    t("msgHello", lang),
    "",
    t("msgIntro", lang),
    "",
    row("msgName", (d.name || "").trim()),
    row("msgCourse", tv(d.course, lang)),
    row("msgClassFor", tv(d.classFor, lang)),
    row("msgLanguage", tv(d.language, lang)),
    row("msgGroup", tv(d.group, lang)),
    row("msgWhere", tv(d.where, lang))
  ];
  if (d.when && d.when.trim()) lines.push(row("msgWhen", d.when.trim()));
  if (d.notes && d.notes.trim()) lines.push("", row("msgNotes", d.notes.trim()));
  lines.push("", t("msgThanks", lang));
  return lines.join("\n");
}
function buildMailtoLink(cfg, data, text, lang) {
  const to = cleanEmail(cfg.email);
  const subject = t("msgSubject", lang) + ": " + tv(data.course, lang) + " (" + tv(data.classFor, lang) + ")";
  return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
}

/* ------------------------- English / Yiddish -------------------------
   Every piece of text on the page has a key (data-i18n="key" in index.html).
   To change a wording, change it here: "en" for English, "yi" for Yiddish. */
const I18N = {
  en: {
    metaTitle: "First LifeSavers | First Aid, CPR & BLS Training in Yiddish and English",
    metaDesc: "Certified First Aid, CPR & AED and BLS courses for shuls, schools, mosdos, camps, offices and homes. Yiddish and English speaking instructors. Separate classes for men and women.",
    skip: "Skip to content",
    brandAria: "First LifeSavers, back to top",
    navAria: "Main",
    navCourses: "Courses",
    navWhy: "Why us",
    navWho: "Who it's for",
    navFaq: "FAQ",
    navBook: "Book a class",
    langLabel: "אידיש",
    langAria: "Switch the site to Yiddish",
    menu: "Menu",
    heroEyebrow: "First Aid · CPR & AED · BLS",
    heroTitle: "Before help arrives, the first minutes are in your hands.",
    heroSub: "Certified, hands-on training for our community, taught in Yiddish or English, wherever you are.",
    ctaCertified: "Get certified",
    ctaFilm: "Watch the film",
    factsAria: "At a glance",
    fact1a: "Yiddish & English",
    fact1b: "speaking instructors",
    fact2a: "Men's & women's classes",
    fact2b: "male and female instructors",
    fact3a: "We come to you",
    fact3b: "shul, school, office or home",
    coursesKicker: "Courses",
    coursesTitle: "Certified courses",
    coursesLead: "Practical skills you'll remember when it counts. Every course is hands-on, in a calm setting, at your pace.",
    c1Title: "First Aid",
    c1Text: "Bleeding, burns, choking, falls, allergic reactions and the everyday emergencies at home, in shul or at camp. Learn what to do first, and what not to do.",
    c1Link: "Ask about First Aid",
    c2Title: "CPR & AED",
    c2Text: "Recognise cardiac arrest, start CPR with confidence and use an AED (defibrillator) the moment one arrives, for adults, children and infants.",
    c2Link: "Ask about CPR & AED",
    c3Title: "BLS for Healthcare Providers",
    c3Text: "Basic Life Support for nurses, EMTs, therapists, aides and other healthcare workers: high-quality CPR, team response, airway and AED skills.",
    c3Link: "Ask about BLS",
    coursesNote: "Contact us for schedule & pricing.",
    filmKicker: "Be the one who knows",
    filmTitle: "No time to guess.",
    filmP1: "When something happens right in front of you, there's no time to look it up. Hatzolah is on the way, and until they arrive, the person standing closest is the first responder.",
    filmP2: "Our courses give you the steps, the practice and the confidence to act in those first minutes.",
    filmFallback: "Your browser can't play this video.",
    whyKicker: "Why us",
    whyTitle: "Training that fits our community",
    whyAlt: "A Chassidish man runs through a shul hallway carrying a first-aid kit",
    why1a: "Yiddish & English",
    why1b: "Instructors who speak your language, so every step is clear the first time.",
    why2a: "Male & female instructors",
    why2b: "Separate classes for men and women, each taught by an instructor of their own.",
    why3a: "We come to you",
    why3b: "Classes in your shul, school, office or home. You pick the place, we bring the equipment.",
    why4a: "Groups & individuals",
    why4b: "A whole staff or a single person. Private sessions and group classes are both available.",
    whoKicker: "Who it's for",
    whoTitle: "For everyone who might be first on the scene",
    who1a: "Parents",
    who1b: "Be ready for the kitchen, the playground and the Shabbos table.",
    who2a: "Teachers & mosdos",
    who2b: "Staff training for chadorim, yeshivos, schools and daycares.",
    who3a: "Camp staff",
    who3b: "Counselors and staff prepared before the summer starts.",
    who4a: "Shul members",
    who4b: "A trained group in every minyan, ready by the kit and the AED.",
    who5a: "Businesses",
    who5b: "Offices, stores and warehouses with a team that knows what to do.",
    who6a: "Healthcare workers",
    who6b: "BLS for providers who need it for work.",
    howKicker: "How it works",
    howTitle: "Three simple steps",
    how1a: "Reach out",
    how1b: "Tell us the course, the group and where you'd like the class.",
    how2a: "Pick a time & place",
    how2b: "We set a date that works for you, at your location.",
    how3a: "Train & get certified",
    how3b: "Hands-on practice with an instructor, then you're ready.",
    howAlt: "A Chassidish man kneels and opens a first-aid kit next to an AED case",
    faqKicker: "FAQ",
    faqTitle: "Questions & answers",
    q1: "Do I need any medical background?",
    a1: "No. First Aid and CPR & AED are made for everyday people. If you can follow clear steps, you can learn this. BLS is the course designed for healthcare providers.",
    q2: "Which course is right for me?",
    a2: "Parents, teachers, staff and shul members usually start with First Aid and/or CPR & AED. Nurses, EMTs and other healthcare workers usually need BLS. Not sure? Send us a message and we'll help you choose.",
    q3: "Are classes separate for men and women?",
    a3: "Yes. We have male and female instructors, and men's and women's classes are held separately.",
    q4: "What language are classes taught in?",
    a4: "Yiddish or English, whichever your group prefers.",
    q5: "Can you come to our shul, school or office?",
    a5: "Yes. Classes can be held in your shul, school, office or home, for groups or for individuals.",
    q6: "Will I be certified?",
    a6: "Yes, these are certified courses. When you book, we'll go over the certification that comes with the course you choose.",
    q7: "How much does it cost, and how long is a class?",
    a7: "It depends on the course and the size of your group. Contact us for schedule & pricing.",
    bookKicker: "Get started",
    bookTitle: "Book a class",
    bookLead: "Fill in a few details and we'll prepare a message for you to send on WhatsApp, by text or by email. Nothing is sent until you press send.",
    bp1: "Yiddish or English",
    bp2: "Men's or women's class",
    bp3: "Your location or ours",
    directLabel: "Or reach us directly",
    numberHint: "Tap to call, text or WhatsApp",
    actCall: "Call",
    actText: "Text",
    actWa: "WhatsApp",
    emailLabel: "Email",
    sheetAsk: "How would you like to reach us?",
    sheetCall: "Call",
    sheetCallSub: "Speak to us now",
    sheetText: "Text message",
    sheetTextSub: "Send an SMS",
    sheetWa: "WhatsApp",
    sheetWaSub: "Message us on WhatsApp",
    sheetCancel: "Cancel",
    sheetClose: "Close",
    fName: "Your name",
    errName: "Please enter your name.",
    fCourse: "Course",
    optChoose: "Choose a course",
    optFirstAid: "First Aid",
    optCpr: "CPR & AED",
    optBls: "BLS for Healthcare Providers",
    optUnsure: "Not sure yet, please advise",
    errCourse: "Please choose a course.",
    fClassFor: "Class for",
    optMen: "Men",
    optWomen: "Women",
    fLanguage: "Language",
    optYiddish: "Yiddish",
    optEnglish: "English",
    fGroup: "Who is joining",
    optJustMe: "Just me",
    optSmall: "A small group (2–10)",
    optLarge: "A larger group (10+)",
    fWhere: "Where",
    optShul: "Shul",
    optSchool: "School / mosad",
    optOffice: "Office / business",
    optHome: "Home",
    optCamp: "Camp",
    optOther: "Other / not sure",
    moreToggle: "Add preferred times or a note",
    optional: "(optional)",
    fWhen: "Preferred dates or times",
    phWhen: "e.g. evenings after Maariv",
    fNotes: "Anything else?",
    btnPrepare: "Prepare my message",
    btnUpdate: "Update my message",
    readyTitle: "Your message is ready",
    readySub: "Choose how to send it. It opens in your app, ready to go.",
    sendWa: "Send on WhatsApp",
    sendOr: "or send another way",
    sendText: "Text",
    sendEmail: "Email",
    sendCall: "Call us",
    copy: "Copy message",
    copied: "Copied!",
    copyFail: "Select the text above to copy",
    footTag1: "Certified First Aid, CPR & AED and BLS training.",
    footTag2: "Yiddish & English speaking instructors.",
    footPasuk: "“Guard your lives carefully.” (Devarim 4:15)",
    footContact: "Contact us",
    footPhoneWa: "Phone & WhatsApp",
    footPhone: "Phone",
    footNavAria: "Footer",
    footCopy: "An independent training provider.",
    backTop: "Back to top",
    msgHello: "Hello First LifeSavers,",
    msgIntro: "I'd like to book a class.",
    msgName: "Name",
    msgCourse: "Course",
    msgClassFor: "Class for",
    msgLanguage: "Language",
    msgGroup: "Who is joining",
    msgWhere: "Where",
    msgWhen: "Preferred dates/times",
    msgNotes: "Notes",
    msgThanks: "Please send me the schedule and pricing. Thank you!",
    msgSubject: "Class booking request"
  },
  yi: {
    metaTitle: "First LifeSavers | ערשטע הילף, CPR און BLS טריינינג אויף אידיש און ענגליש",
    metaDesc: "סערטיפיצירטע קורסן אין ערשטע הילף, CPR & AED און BLS פאר שולן, סקולס, מוסדות, קעמפס, אפיסעס און שטובן. אינסטרוקטארן וואס רעדן אידיש און ענגליש. באזונדערע קלאסן פאר מענער און פרויען.",
    skip: "שפרינגט צום אינהאלט",
    brandAria: "First LifeSavers, צוריק ארויף",
    navAria: "הויפט מעניו",
    navCourses: "קורסן",
    navWhy: "פארוואס אונז",
    navWho: "פאר וועמען",
    navFaq: "פראגעס",
    navBook: "באשטעלן א קלאס",
    langLabel: "English",
    langAria: "Switch the site to English",
    menu: "מעניו",
    heroEyebrow: "ערשטע הילף · CPR & AED · BLS",
    heroTitle: "ביז די הילף קומט אן, זענען די ערשטע מינוטן אין אייערע הענט.",
    heroSub: "סערטיפיצירטע, פראקטישע טריינינג פאר אונזער ציבור, אויף אידיש אדער ענגליש, וואו איר זענט.",
    ctaCertified: "ווערט סערטיפיצירט",
    ctaFilm: "קוקט דעם ווידעא",
    factsAria: "אין קורצן",
    fact1a: "אידיש און ענגליש",
    fact1b: "רעדנדע אינסטרוקטארן",
    fact2a: "קלאסן פאר מענער און פרויען",
    fact2b: "מענער און פרויען אינסטרוקטארן",
    fact3a: "מיר קומען צו אייך",
    fact3b: "שול, סקול, אפיס אדער שטוב",
    coursesKicker: "קורסן",
    coursesTitle: "סערטיפיצירטע קורסן",
    coursesLead: "פראקטישע ידיעות וואס איר וועט געדענקען ווען מען דארף עס. יעדער קורס איז מיט פראקטיצירן, אין א רואיגע סביבה, לויט אייער טעמפא.",
    c1Title: "ערשטע הילף",
    c1Text: "בלוטן, פארברענונגען, דערשטיקן זיך, פאלן, אלערגישע רעאקציעס און די געווענליכע עמערדזשענסיס אינדערהיים, אין שול אדער אין קעמפ. לערנט וואס צו טון קודם, און וואס נישט צו טון.",
    c1Link: "פרעגט וועגן ערשטע הילף",
    c2Title: "CPR & AED",
    c2Text: "דערקענט ווען דאס הארץ שטעלט זיך אפ, הייבט אן CPR מיט זיכערקייט, און ניצט אן AED (דעפיברילאטאר) ווי נאר עס קומט אן, פאר דערוואקסענע, קינדער און עופעלעך.",
    c2Link: "פרעגט וועגן CPR & AED",
    c3Title: "BLS פאר מעדיצינישע ארבעטער",
    c3Text: "Basic Life Support פאר נוירסעס, EMTs, טעראפיסטן, העלפער און אנדערע מעדיצינישע ארבעטער: גוטע CPR, ארבעטן צוזאמען אלס טיעם, אטעם-וועג (airway) און AED.",
    c3Link: "פרעגט וועגן BLS",
    coursesNote: "פארבינדט אייך מיט אונז פאר צייטן און פרייזן.",
    filmKicker: "זייט דער וואס ווייסט",
    filmTitle: "נישטא קיין צייט צו טראכטן.",
    filmP1: "ווען עפעס פאסירט פאר אייערע אויגן, איז נישטא קיין צייט עס נאכצוקוקן. הצלה איז אויפן וועג, און ביז זיי קומען אן, איז דער וואס שטייט די נאענטסטע דער ערשטער העלפער.",
    filmP2: "אונזערע קורסן געבן אייך די טריט, די פראקטיק און די זיכערקייט צו האנדלען אין יענע ערשטע מינוטן.",
    filmFallback: "אייער בראוזער קען נישט שפילן דעם ווידעא.",
    whyKicker: "פארוואס אונז",
    whyTitle: "טריינינג וואס פאסט פאר אונזער ציבור",
    whyAlt: "א חסידישער איד לויפט דורכן שול קארידאר מיט א ערשטע-הילף קעסטל",
    why1a: "אידיש און ענגליש",
    why1b: "אינסטרוקטארן וואס רעדן אייער שפראך, אז יעדער טריט זאל זיין קלאר פונעם ערשטן מאל.",
    why2a: "מענער און פרויען אינסטרוקטארן",
    why2b: "באזונדערע קלאסן פאר מענער און פאר פרויען, יעדע איינע מיט אן אייגענעם אינסטרוקטאר.",
    why3a: "מיר קומען צו אייך",
    why3b: "קלאסן אין אייער שול, סקול, אפיס אדער שטוב. איר קלייבט דעם ארט, מיר ברענגען די עקוויפמענט.",
    why4a: "גרופעס און יחידים",
    why4b: "א גאנצער שטאב אדער איין מענטש. פריוואטע און גרופע קלאסן זענען ביידע פאראן.",
    whoKicker: "פאר וועמען",
    whoTitle: "פאר יעדן וואס קען זיין דער ערשטער ביים פלאץ",
    who1a: "עלטערן",
    who1b: "זייט גרייט פאר די קיך, די שפילפלאץ און דעם שבת טיש.",
    who2a: "לערער און מוסדות",
    who2b: "טריינינג פאר שטאב אין חדרים, ישיבות, סקולס און דעיקעירס.",
    who3a: "קעמפ שטאב",
    who3b: "קאונסעלארס און שטאב גרייט נאך איידער דער זומער הייבט זיך אן.",
    who4a: "מתפללים אין שול",
    who4b: "א טרענירטע גרופע אין יעדן מנין, גרייט ביים קעסטל און ביים AED.",
    who5a: "ביזנעסער",
    who5b: "אפיסעס, געשעפטן און וועירהאוזעס מיט א טיעם וואס ווייסט וואס צו טון.",
    who6a: "מעדיצינישע ארבעטער",
    who6b: "BLS פאר די וואס דארפן עס פאר דער ארבעט.",
    howKicker: "ווי אזוי עס ארבעט",
    howTitle: "דריי פשוטע טריט",
    how1a: "פארבינדט אייך",
    how1b: "זאגט אונז וועלכער קורס, ווער עס קומט, און וואו איר ווילט דעם קלאס.",
    how2a: "קלייבט א צייט און ארט",
    how2b: "מיר שטעלן אוועק א דאטום וואס פאסט פאר אייך, ביי אייך אין ארט.",
    how3a: "לערנט און ווערט סערטיפיצירט",
    how3b: "פראקטיצירט מיט אן אינסטרוקטאר, און איר זענט גרייט.",
    howAlt: "א חסידישער איד קניט און עפנט א ערשטע-הילף קעסטל לעבן אן AED",
    faqKicker: "פראגעס",
    faqTitle: "פראגעס און תשובות",
    q1: "דארף איך האבן א מעדיצינישן הינטערגרונט?",
    a1: "ניין. ערשטע הילף און CPR & AED זענען געמאכט פאר יעדן איינעם. אויב איר קענט נאכגיין קלארע טריט, קענט איר דאס לערנען. BLS איז דער קורס פאר מעדיצינישע ארבעטער.",
    q2: "וועלכער קורס פאסט פאר מיר?",
    a2: "עלטערן, לערער, שטאב און מתפללים הייבן געווענליך אן מיט ערשטע הילף און/אדער CPR & AED. נוירסעס, EMTs און אנדערע מעדיצינישע ארבעטער דארפן געווענליך BLS. נישט זיכער? שיקט אונז א מעסעדזש און מיר וועלן אייך העלפן אויסקלייבן.",
    q3: "זענען די קלאסן באזונדער פאר מענער און פרויען?",
    a3: "יא. מיר האבן מענער און פרויען אינסטרוקטארן, און די קלאסן פאר מענער און פאר פרויען זענען באזונדער.",
    q4: "אויף וועלכע שפראך ווערן די קלאסן געגעבן?",
    a4: "אידיש אדער ענגליש, ווי אייער גרופע וויל.",
    q5: "קענט איר קומען צו אונזער שול, סקול אדער אפיס?",
    a5: "יא. מען קען מאכן די קלאסן אין אייער שול, סקול, אפיס אדער שטוב, פאר גרופעס אדער פאר יחידים.",
    q6: "וועל איך באקומען א סערטיפיקאט?",
    a6: "יא, די קורסן זענען סערטיפיצירט. ווען איר באשטעלט, וועלן מיר אייך דערקלערן וועלכע סערטיפיקאציע קומט מיט דעם קורס וואס איר קלייבט.",
    q7: "וויפיל קאסט עס, און ווי לאנג דויערט א קלאס?",
    a7: "עס ווענדט זיך אין דעם קורס און ווי גרויס אייער גרופע איז. פארבינדט אייך מיט אונז פאר צייטן און פרייזן.",
    bookKicker: "הייבט אן",
    bookTitle: "באשטעלן א קלאס",
    bookLead: "פילט אויס א פאר פרטים, און מיר גרייטן צו א מעסעדזש וואס איר קענט שיקן אויף WhatsApp, טעקסט אדער אימעיל. גארנישט ווערט נישט געשיקט ביז איר דריקט \"שיקן\".",
    bp1: "אידיש אדער ענגליש",
    bp2: "קלאס פאר מענער אדער פרויען",
    bp3: "ביי אייך אדער ביי אונז",
    directLabel: "אדער פארבינדט אייך גלייך",
    numberHint: "דריקט צו רופן, טעקסטן אדער WhatsApp",
    actCall: "רופן",
    actText: "טעקסט",
    actWa: "WhatsApp",
    emailLabel: "אימעיל",
    sheetAsk: "ווי אזוי ווילט איר זיך פארבינדן?",
    sheetCall: "רופן",
    sheetCallSub: "רעדט מיט אונז יעצט",
    sheetText: "טעקסט מעסעדזש",
    sheetTextSub: "שיקט א SMS",
    sheetWa: "WhatsApp",
    sheetWaSub: "שרייבט אונז אויף WhatsApp",
    sheetCancel: "צוריק",
    sheetClose: "צומאכן",
    fName: "אייער נאמען",
    errName: "ביטע שרייבט אריין אייער נאמען.",
    fCourse: "קורס",
    optChoose: "קלייבט א קורס",
    optFirstAid: "ערשטע הילף",
    optCpr: "CPR & AED",
    optBls: "BLS פאר מעדיצינישע ארבעטער",
    optUnsure: "נאך נישט זיכער, ביטע העלפט מיר",
    errCourse: "ביטע קלייבט א קורס.",
    fClassFor: "קלאס פאר",
    optMen: "מענער",
    optWomen: "פרויען",
    fLanguage: "שפראך",
    optYiddish: "אידיש",
    optEnglish: "ענגליש",
    fGroup: "ווער קומט",
    optJustMe: "נאר איך",
    optSmall: "א קליינע גרופע (2 ביז 10)",
    optLarge: "א גרעסערע גרופע (10 אדער מער)",
    fWhere: "וואו",
    optShul: "שול",
    optSchool: "סקול / מוסד",
    optOffice: "אפיס / ביזנעס",
    optHome: "שטוב",
    optCamp: "קעמפ",
    optOther: "אנדערש / נישט זיכער",
    moreToggle: "צולייגן צייטן אדער א באמערקונג",
    optional: "(נישט נויטיג)",
    fWhen: "בעסטע טעג אדער צייטן",
    phWhen: "למשל, ביינאכט נאך מעריב",
    fNotes: "נאך עפעס?",
    btnPrepare: "גרייט צו מיין מעסעדזש",
    btnUpdate: "דערהיינטיג מיין מעסעדזש",
    readyTitle: "אייער מעסעדזש איז גרייט",
    readySub: "קלייבט ווי אזוי צו שיקן. עס עפנט זיך אין אייער אפ, גרייט צו שיקן.",
    sendWa: "שיקן אויף WhatsApp",
    sendOr: "אדער שיקט אויף אן אנדער וועג",
    sendText: "טעקסט",
    sendEmail: "אימעיל",
    sendCall: "רופט אונז",
    copy: "קאפירן דעם מעסעדזש",
    copied: "קאפירט!",
    copyFail: "צייכנט אן דעם טעקסט אויבן צו קאפירן",
    footTag1: "סערטיפיצירטע טריינינג אין ערשטע הילף, CPR & AED און BLS.",
    footTag2: "אינסטרוקטארן וואס רעדן אידיש און ענגליש.",
    footPasuk: "(דברים ד, טו)",
    footContact: "פארבינדט אייך",
    footPhoneWa: "טעלעפאן און WhatsApp",
    footPhone: "טעלעפאן",
    footNavAria: "אונטן",
    footCopy: "אן אומאפהענגיגע טריינינג פירמע.",
    backTop: "צוריק ארויף",
    msgHello: "שלום First LifeSavers,",
    msgIntro: "איך וויל באשטעלן א קלאס.",
    msgName: "נאמען",
    msgCourse: "קורס",
    msgClassFor: "קלאס פאר",
    msgLanguage: "שפראך",
    msgGroup: "ווער קומט",
    msgWhere: "וואו",
    msgWhen: "בעסטע צייטן",
    msgNotes: "באמערקונגען",
    msgThanks: "ביטע שיקט מיר די צייטן און פרייזן. א שיינעם דאנק!",
    msgSubject: "באשטעלונג פאר א קלאס"
  }
};

/* ------------------------------ page code ----------------------------- */
if (typeof document !== "undefined") {
  document.documentElement.classList.remove("no-js");
  const start = function () {
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conf = isConfigured(SITE_CONFIG);
    let lang = "en";

    /* year */
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    /* ---------- language ---------- */
    const metaDesc = $('meta[name="description"]');
    function setLang(next) {
      lang = next === "yi" ? "yi" : "en";
      const L = I18N[lang];
      const root = document.documentElement;
      root.lang = lang;
      root.dir = lang === "yi" ? "rtl" : "ltr";
      $$("[data-i18n]").forEach(el => { const v = L[el.dataset.i18n]; if (v != null) el.textContent = v; });
      $$("[data-i18n-ph]").forEach(el => { el.placeholder = L[el.dataset.i18nPh]; });
      $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", L[el.dataset.i18nAria]); });
      $$("[data-i18n-alt]").forEach(el => { el.alt = L[el.dataset.i18nAlt]; });
      document.title = L.metaTitle;
      if (metaDesc) metaDesc.content = L.metaDesc;
      const toggle = $("#lang-toggle");
      toggle.lang = lang === "yi" ? "en" : "yi";
      toggle.dir = lang === "yi" ? "ltr" : "rtl";
      updateFooterLabel();
      if (lastData) showMessage(lastData, false);
      try { localStorage.setItem("fls-lang", lang); } catch (e) {}
    }
    $("#lang-toggle").addEventListener("click", () => setLang(lang === "yi" ? "en" : "yi"));

    /* ---------- header ---------- */
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

    /* ---------- hero video: tall on phones, wide elsewhere ---------- */
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

    /* ---------- reveal on scroll ---------- */
    const items = $$(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      items.forEach(el => io.observe(el));
    } else items.forEach(el => el.classList.add("in"));

    /* ---------- contact details (from SITE_CONFIG) ---------- */
    const telHref = conf.phone ? buildTelLink(SITE_CONFIG) : "";
    const smsHref = conf.phone ? buildSmsLink(SITE_CONFIG, "") : "";
    const waHref = conf.whatsapp ? buildWhatsAppLink(SITE_CONFIG, "") : "";
    const mainNumber = conf.phone ? SITE_CONFIG.phoneNumber : SITE_CONFIG.whatsappNumber;
    const sameNumber = conf.phone && conf.whatsapp && cleanNumber(SITE_CONFIG.phoneNumber) === cleanNumber(SITE_CONFIG.whatsappNumber);
    const email = cleanEmail(SITE_CONFIG.email);
    function setLink(id, href) { const el = $(id); if (!el) return; el.hidden = !href; if (href) el.href = href; }
    [["#dq-call", "#fc-call", "#sh-call", telHref], ["#dq-text", "#fc-text", "#sh-text", smsHref], ["#dq-wa", "#fc-wa", "#sh-wa", waHref]]
      .forEach(([a, b, c, href]) => { setLink(a, href); setLink(b, href); setLink(c, href); });
    const anyNumber = conf.phone || conf.whatsapp;
    $$("#direct-number, #fc-v, #sheet-number").forEach(el => { el.textContent = anyNumber ? displayNumber(mainNumber) : ""; });
    $("#number-btn").hidden = !anyNumber;
    $("#fc-number").hidden = !anyNumber;
    $("#direct-quick").hidden = !anyNumber;
    $("#fc-quick").hidden = !anyNumber;
    const quickCount = [telHref, smsHref, waHref].filter(Boolean).length;
    $("#direct-quick").style.gridTemplateColumns = "repeat(" + Math.max(quickCount, 1) + ",1fr)";
    setLink("#direct-email", email ? "mailto:" + email : "");
    setLink("#fc-mail", email ? "mailto:" + email : "");
    $("#direct-email-v").textContent = email; $("#fc-mail-v").textContent = email;
    $("#direct").hidden = !(anyNumber || email);
    $("#footer-contact").hidden = !(anyNumber || email);
    function updateFooterLabel() {
      const k = $("#fc-k"); if (!k) return;
      const key = sameNumber || !conf.whatsapp ? (conf.whatsapp ? "footPhoneWa" : "footPhone") : (conf.phone ? "footPhone" : "actWa");
      k.dataset.i18n = key; k.textContent = I18N[lang][key];
    }
    if (!conf.whatsapp || !conf.email || !conf.phone) console.info("[First LifeSavers] Fill in SITE_CONFIG at the top of script.js.");

    /* ---------- call / text / WhatsApp pop-up ---------- */
    const sheet = $("#sheet");
    let lastFocus = null;
    function openSheet(ev) {
      lastFocus = ev && ev.currentTarget;
      if (sheet.showModal) { sheet.showModal(); } else { sheet.setAttribute("open", ""); }
      document.body.classList.add("sheet-open");
    }
    function closeSheet() {
      if (sheet.close) sheet.close(); else sheet.removeAttribute("open");
    }
    sheet.addEventListener("close", () => { document.body.classList.remove("sheet-open"); if (lastFocus) lastFocus.focus({ preventScroll: true }); });
    $$("[data-sheet]").forEach(b => b.addEventListener("click", openSheet));
    sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
    $("#sheet-x").addEventListener("click", closeSheet);
    $("#sheet-cancel").addEventListener("click", closeSheet);
    $$(".sheet-opt").forEach(a => a.addEventListener("click", () => setTimeout(closeSheet, 50)));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.hasAttribute("open")) closeSheet(); });

    /* ---------- booking form ---------- */
    const form = $("#book-form");
    const courseSel = $("#f-course");
    $$("[data-course]").forEach(a => a.addEventListener("click", () => { courseSel.value = a.dataset.course; check("course", true); }));

    function setOpen(wrap, open) {
      wrap.classList.toggle("is-open", open);
      if (open) wrap.removeAttribute("inert"); else wrap.setAttribute("inert", "");
    }
    const more = $("#more"), moreBtn = $("#more-toggle");
    setOpen(more, false);
    moreBtn.addEventListener("click", () => {
      const open = moreBtn.getAttribute("aria-expanded") !== "true";
      moreBtn.setAttribute("aria-expanded", String(open));
      setOpen(more, open);
      if (open) setTimeout(() => $("#f-when").focus({ preventScroll: true }), 250);
    });

    const readyWrap = $("#ready-wrap"), ready = $("#ready"), readyText = $("#ready-text");
    const wa = $("#wa-link"), mail = $("#mail-link"), sms = $("#sms-link"), call = $("#call-link");
    const copyBtn = $("#copy-btn"), copyLabel = $("#copy-label"), prepLabel = $("#prepare-label");
    setOpen(readyWrap, false);
    sms.hidden = !conf.phone; call.hidden = !conf.phone;
    if (conf.phone) call.href = telHref;
    let lastData = null;

    function check(id, ok) {
      const f = $("#f-" + id), e = $("#err-" + id);
      f.classList.toggle("invalid", !ok); f.setAttribute("aria-invalid", String(!ok)); e.hidden = ok;
      return ok;
    }
    function showMessage(d, scroll) {
      const text = buildMessage(d, lang);
      readyText.textContent = text;
      readyText.dir = lang === "yi" ? "rtl" : "ltr";
      wa.href = buildWhatsAppLink(SITE_CONFIG, text);
      mail.href = buildMailtoLink(SITE_CONFIG, d, text, lang);
      if (conf.phone) sms.href = buildSmsLink(SITE_CONFIG, text);
      prepLabel.dataset.i18n = "btnUpdate"; prepLabel.textContent = I18N[lang].btnUpdate;
      setOpen(readyWrap, true);
      if (scroll) {
        ready.focus({ preventScroll: true });
        setTimeout(() => ready.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }), reduceMotion ? 0 : 260);
      }
    }
    form.addEventListener("submit", ev => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      const ok = [check("name", !!(d.name || "").trim()), check("course", !!d.course)].every(Boolean);
      if (!ok) { (form.querySelector(".invalid") || form).focus(); return; }
      lastData = d;
      showMessage(d, true);
    });
    ["name", "course"].forEach(id => $("#f-" + id).addEventListener("input", () => { if ($("#f-" + id).classList.contains("invalid")) check(id, true); }));
    copyBtn.addEventListener("click", async () => {
      let key = "copied";
      try { await navigator.clipboard.writeText(readyText.textContent); }
      catch (e) { key = "copyFail"; }
      copyLabel.textContent = I18N[lang][key]; copyBtn.classList.toggle("done", key === "copied");
      setTimeout(() => { copyLabel.textContent = I18N[lang].copy; copyBtn.classList.remove("done"); }, 2200);
    });

    /* remembered language */
    let saved = "en";
    try { saved = localStorage.getItem("fls-lang") || "en"; } catch (e) {}
    if (saved === "yi") setLang("yi"); else updateFooterLabel();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SITE_CONFIG, I18N, VALUE_KEYS, cleanNumber, cleanEmail, isConfigured, displayNumber, buildMessage, buildWhatsAppLink, buildMailtoLink, buildSmsLink, buildTelLink, t, tv };
}
