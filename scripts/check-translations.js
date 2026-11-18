// Checks every language pack against English: same keys, same {{placeholders}}
// and inline tags, and the plural forms each language needs.
//   node scripts/check-translations.js            (all languages)
//   node scripts/check-translations.js es fr      (some)
// Exit code 1 if anything is wrong.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CLIENT = path.join(ROOT, "client/src/i18n/locales");
const SERVER = path.join(ROOT, "locales");
const LANGS = ["es", "fr", "de", "pt", "it", "zh", "ja", "ko", "hi", "ar", "ru", "nb"];
const only = process.argv.slice(2);
const langs = only.length ? only : LANGS;

const placeholders = (s) => (String(s).match(/\{\{\s*\w+\s*\}\}/g) || []).map((p) => p.replace(/\s/g, "")).sort();
const tags = (s) => (String(s).match(/<\/?\w+\s*\/?>/g) || []).map((x) => x.replace(/\s/g, "")).sort();
const isPlural = (v) => v && typeof v === "object" && ("other" in v) && Object.keys(v).every((k) => ["zero", "one", "two", "few", "many", "other"].includes(k));

// Flatten nested objects (plural objects stay as one leaf)
const flatten = (obj, prefix = "", out = {}) => {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !isPlural(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
};

const problems = [];
const compareLeaf = (where, key, en, tr, lang) => {
  if (tr === undefined) return problems.push(`${where}: missing ${key}`);
  if (isPlural(en)) {
    if (!isPlural(tr)) return problems.push(`${where}: ${key} should be a plural object`);
    const needed = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
    for (const form of needed) if (!(form in tr)) problems.push(`${where}: ${key} missing plural form "${form}"`);
    const want = placeholders(en.other).filter((p) => p !== "{{count}}");
    for (const [form, val] of Object.entries(tr)) {
      const have = placeholders(val);
      for (const p of want) if (!have.includes(p)) problems.push(`${where}: ${key}.${form} lost ${p}`);
    }
    return;
  }
  if (typeof tr !== "string") return problems.push(`${where}: ${key} is not a string`);
  if (typeof en === "string" && en.trim() && !tr.trim()) problems.push(`${where}: ${key} is empty`);
  if (placeholders(en).join() !== placeholders(tr).join()) problems.push(`${where}: ${key} placeholders ${placeholders(en)} vs ${placeholders(tr)}`);
  if (tags(en).join() !== tags(tr).join()) problems.push(`${where}: ${key} tags ${tags(en)} vs ${tags(tr)}`);
};

let enCount = 0;
// Client: one file per namespace
const nsFiles = fs.readdirSync(path.join(CLIENT, "en")).filter((f) => f.endsWith(".json"));
for (const lang of langs) {
  for (const file of nsFiles) {
    const en = flatten(JSON.parse(fs.readFileSync(path.join(CLIENT, "en", file), "utf8")));
    if (lang === langs[0]) enCount += Object.keys(en).length;
    const p = path.join(CLIENT, lang, file);
    if (!fs.existsSync(p)) { problems.push(`client ${lang}/${file}: file missing`); continue; }
    let tr;
    try { tr = flatten(JSON.parse(fs.readFileSync(p, "utf8"))); } catch (e) { problems.push(`client ${lang}/${file}: invalid JSON (${e.message})`); continue; }
    for (const key of Object.keys(en)) compareLeaf(`client ${lang}/${file}`, key, en[key], tr[key], lang);
    for (const key of Object.keys(tr)) if (!(key in en)) problems.push(`client ${lang}/${file}: extra key ${key}`);
  }
  // Server: one flat file
  const enS = JSON.parse(fs.readFileSync(path.join(SERVER, "en.json"), "utf8"));
  if (lang === langs[0]) enCount += Object.keys(enS).length;
  const ps = path.join(SERVER, `${lang}.json`);
  if (!fs.existsSync(ps)) { problems.push(`server ${lang}.json: file missing`); continue; }
  let trS;
  try { trS = JSON.parse(fs.readFileSync(ps, "utf8")); } catch (e) { problems.push(`server ${lang}.json: invalid JSON (${e.message})`); continue; }
  for (const key of Object.keys(enS)) compareLeaf(`server ${lang}.json`, key, enS[key], trS[key], lang);
  for (const key of Object.keys(trS)) if (!(key in enS)) problems.push(`server ${lang}.json: extra key ${key}`);
}

console.log(`English strings: ${enCount} (client + server). Languages checked: ${langs.join(", ")}`);
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.slice(0, 200).forEach((p) => console.log("  " + p));
  if (problems.length > 200) console.log(`  … and ${problems.length - 200} more`);
  process.exit(1);
}
console.log("All packs match English.");
