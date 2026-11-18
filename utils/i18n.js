// Server-side translations: error popups ({ header, message }), emails and
// push notifications, in the user's chosen language. Packs live in
// /locales/<code>.json (flat keys, "{{name}}" placeholders), English is the
// fallback. The client's packs are separate (client/src/i18n).
const fs = require("fs");
const path = require("path");

const LANGS = ["en", "es", "fr", "de", "pt", "it", "zh", "ja", "ko", "hi", "ar", "ru", "nb"];
// Other codes browsers use for a language we ship (Norwegian: "no", Nynorsk)
const ALIASES = { no: "nb", nn: "nb" };
const DEFAULT = "en";

const packs = {};
for (const code of LANGS) {
  const file = path.join(__dirname, "..", "locales", `${code}.json`);
  try {
    packs[code] = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    packs[code] = {};
  }
}

const normalize = (code) => {
  if (!code || typeof code !== "string") return null;
  const raw = code.trim().toLowerCase().split(/[-_]/)[0];
  const base = ALIASES[raw] || raw;
  return LANGS.includes(base) ? base : null;
};

const interpolate = (str, vars = {}) =>
  str.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) =>
    vars[k] === undefined || vars[k] === null ? "" : String(vars[k])
  );

// tr("es", "friend.notYet.message", { name: "Alex" })
const tr = (lang, key, vars) => {
  const code = normalize(lang) || DEFAULT;
  let str = packs[code]?.[key];
  if (str === undefined) str = packs[DEFAULT]?.[key];
  if (str === undefined) return key;
  // Plurals: "key_one" / "key_other" when a count is given
  if (typeof str === "object" && str !== null) {
    const form = new Intl.PluralRules(code).select(Number(vars?.count ?? 0));
    str = str[form] ?? str.other ?? Object.values(str)[0];
  }
  return interpolate(String(str), vars);
};

// The language for a request: the signed-in user's choice, then the app's
// X-Frolik-Lang header (signed-out screens), then the browser's languages
const reqLang = (req) => {
  const fromUser = normalize(req.user?.language);
  if (fromUser) return fromUser;
  const fromHeader = normalize(req.get?.("X-Frolik-Lang"));
  if (fromHeader) return fromHeader;
  const accept = String(req.get?.("Accept-Language") || "")
    .split(",")
    .map((p) => normalize(p.split(";")[0]))
    .find(Boolean);
  return accept || DEFAULT;
};

// For messages to someone other than the requester (emails, pushes)
const userLang = (user) => normalize(user?.language) || DEFAULT;

// Text for one recipient, resolved when it is sent: (user) => string.
// webpushNotify accepts these for title/body so each user gets their language.
const forUser = (key, vars) => (user) => tr(userLang(user), key, vars);

// Express middleware: req.lang and req.t(key, vars)
const attachI18n = (req, res, next) => {
  req.lang = reqLang(req);
  req.t = (key, vars) => tr(req.lang, key, vars);
  next();
};

module.exports = { LANGS, DEFAULT, normalize, tr, reqLang, userLang, forUser, attachI18n };
