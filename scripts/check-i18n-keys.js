// Every literal translation key used in client code must exist in the
// English packs (client/src/i18n/locales/en). Dynamic keys (template
// strings, "data.categories." + x) are listed separately for a look.
const fs = require("fs");
const path = require("path");
const SRC = path.join(__dirname, "../client/src");
const EN = path.join(SRC, "i18n/locales/en");

const en = {};
for (const f of fs.readdirSync(EN).filter((f) => f.endsWith(".json")))
  en[f.replace(/\.json$/, "")] = JSON.parse(fs.readFileSync(path.join(EN, f), "utf8"));
const has = (key) => {
  const [ns, ...rest] = key.split(".");
  let node = en[ns];
  for (const p of rest) { if (node == null || typeof node !== "object") return false; node = node[p]; }
  return node !== undefined;
};

const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (!["images", "i18n"].includes(e.name)) walk(p); }
  else if (/\.(jsx?|tsx?)$/.test(e.name)) files.push(p);
});
walk(SRC);

const missing = [], dynamic = new Set();
const RE = /\b(?:t|tOr)\(\s*(["'`])([^"'`]+)\1|\bk=\{?\s*(["'`])([^"'`]+)\3/g;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = RE.exec(src))) {
    const quote = m[1] || m[3], key = m[2] || m[4];
    if (quote === "`" && key.includes("${")) { dynamic.add(`${path.relative(SRC, file)}: ${key}`); continue; }
    if (/\.$/.test(key)) { dynamic.add(`${path.relative(SRC, file)}: ${key}…`); continue; }
    if (!/^[a-zA-Z]+\.[\w.]+$/.test(key)) continue;
    if (!has(key)) missing.push(`${path.relative(SRC, file)}: ${key}`);
  }
}
console.log(`Scanned ${files.length} files.`);
if (dynamic.size) { console.log(`Dynamic keys (${dynamic.size}):`); [...dynamic].forEach((d) => console.log("  " + d)); }
if (missing.length) { console.log(`MISSING in English packs (${missing.length}):`); missing.forEach((m) => console.log("  " + m)); process.exit(1); }
console.log("Every literal key exists.");
