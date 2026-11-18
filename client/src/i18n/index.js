// Frolik's interface translations.
//
//   const { t } = useT();            // in a component (re-renders on change)
//   t("chat.empty.title")            // "Nothing to show yet!"
//   t("outing.daysLeft", { count })  // plural: key holds { one, other }
//   t("friend.added", { name })      // "{{name}}" placeholders
//   <T k="outing.leaveWarning" />    // inline <b>…</b> / <br/> in a string
//   formatDate(date, { dateStyle: "medium" })
//
// Packs: src/i18n/locales/<code>/<namespace>.json, nested objects; a key is
// "<namespace>.<path>". English is bundled and is the fallback for anything
// missing; other languages load on demand. Outside components (store
// actions, utils) use the plain t() export.
import { Fragment, cloneElement, createElement, useSyncExternalStore } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  languageDir,
  normalizeLanguage,
} from "./languages";

// English: every namespace file, bundled
const enContext = require.context("./locales/en", false, /\.json$/);
const nsName = (file) => file.replace(/^\.\//, "").replace(/\.json$/, "");
const EN = {};
enContext.keys().forEach((file) => {
  EN[nsName(file)] = enContext(file);
});

// Other languages: one chunk per file, fetched when picked
const lazyContext = require.context("./locales", true, /^\.\/[a-z]{2}\/[\w-]+\.json$/, "lazy");

const packs = { en: EN };
const loading = {};

const loadPack = (code) => {
  if (packs[code]) return Promise.resolve(packs[code]);
  if (loading[code]) return loading[code];
  const files = lazyContext.keys().filter((k) => k.startsWith(`./${code}/`));
  loading[code] = Promise.all(
    files.map((file) =>
      lazyContext(file).then((mod) => [
        file.replace(`./${code}/`, "").replace(/\.json$/, ""),
        mod.default || mod,
      ])
    )
  )
    .then((entries) => {
      packs[code] = Object.fromEntries(entries);
      return packs[code];
    })
    .finally(() => delete loading[code]);
  return loading[code];
};

// ── Current language ──────────────────────────────────────────────────────
const STORAGE_KEY = "frolik:lang";
const listeners = new Set();
let current = DEFAULT_LANGUAGE;

const readStored = () => {
  try {
    return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const fromBrowser = () =>
  (navigator.languages || [navigator.language])
    .map(normalizeLanguage)
    .find(Boolean) || null;

const applyDocument = (code) => {
  const root = document.documentElement;
  root.setAttribute("lang", code);
  root.setAttribute("dir", languageDir(code));
};

export const getLanguage = () => current;

// Switch the app's language (loads its pack first). remember: keep it for
// this device so signed-out screens use it too.
export const setLanguage = async (code, { remember = true } = {}) => {
  const next = normalizeLanguage(code) || DEFAULT_LANGUAGE;
  try {
    await loadPack(next);
  } catch {
    // pack failed to load (offline?): stay on what we have
    if (next !== DEFAULT_LANGUAGE) return current;
  }
  if (remember) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }
  if (next !== current) {
    current = next;
    applyDocument(next);
    listeners.forEach((l) => l());
  }
  return current;
};

// On app start: this device's choice, else the browser's language
export const initLanguage = () => {
  const start = readStored() || fromBrowser() || DEFAULT_LANGUAGE;
  applyDocument(DEFAULT_LANGUAGE);
  if (start !== DEFAULT_LANGUAGE) setLanguage(start, { remember: false });
};

// A signed-in account's saved language wins over the device's
export const syncUserLanguage = (user) => {
  const saved = normalizeLanguage(user?.language);
  if (saved && saved !== current) setLanguage(saved);
};

// ── Lookup ────────────────────────────────────────────────────────────────
const lookup = (pack, key) => {
  if (!pack) return undefined;
  const [ns, ...rest] = key.split(".");
  let node = pack[ns];
  for (const part of rest) {
    if (node == null) return undefined;
    node = node[part];
  }
  return node;
};

const interpolate = (str, vars) =>
  vars
    ? str.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) =>
        vars[k] === undefined || vars[k] === null ? "" : String(vars[k])
      )
    : str;

const missing = new Set();

export const t = (key, vars) => {
  let value = lookup(packs[current], key);
  if (value === undefined) value = lookup(EN, key);
  if (value === undefined) {
    if (process.env.NODE_ENV === "development" && !missing.has(key)) {
      missing.add(key);
      console.warn(`[i18n] missing key: ${key}`);
    }
    return key;
  }
  // Plurals: { one, other, few, many, zero, two }
  if (value && typeof value === "object") {
    const n = Number(vars?.count ?? 0);
    const form = new Intl.PluralRules(current).select(n);
    value = value[form] ?? value.other ?? "";
  }
  return interpolate(String(value), vars);
};

// A translation, or `fallback` when there is none (e.g. a category added to
// the database after the packs were written): tOr("data.categories." + c, c)
export const tOr = (key, fallback, vars) => (hasKey(key) ? t(key, vars) : fallback);

// Does the key exist (in this language or English)?
export const hasKey = (key) =>
  lookup(packs[current], key) !== undefined || lookup(EN, key) !== undefined;

// ── Formatting ────────────────────────────────────────────────────────────
const LOCALE_TAGS = { zh: "zh-CN", pt: "pt-BR" };
export const localeTag = () => LOCALE_TAGS[current] || current;

export const formatDate = (date, options = { dateStyle: "medium" }) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return "";
  return new Intl.DateTimeFormat(localeTag(), options).format(d);
};

export const formatNumber = (n, options) =>
  new Intl.NumberFormat(localeTag(), options).format(n);

// ── React ─────────────────────────────────────────────────────────────────
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useLanguage = () =>
  useSyncExternalStore(subscribe, getLanguage, getLanguage);

// Re-renders the component when the language changes
export const useT = () => {
  const lang = useLanguage();
  return { t, tOr, lang, formatDate, formatNumber };
};

// A translated string with simple inline markup: <b>…</b>, <i>…</i>,
// <strong>…</strong>, <br/>. `components` can map other tag names, e.g.
// { link: <a href="…" /> }.
const TAG = /<(\w+)\s*\/>|<(\w+)>(.*?)<\/\2>/gs;
export const T = ({ k, vars, components = {} }) => {
  useLanguage();
  const str = t(k, vars);
  const out = [];
  let last = 0;
  let i = 0;
  str.replace(TAG, (match, selfTag, tag, inner, offset) => {
    if (offset > last) out.push(str.slice(last, offset));
    const name = selfTag || tag;
    const custom = components[name];
    const key = `t${i++}`;
    if (selfTag) {
      out.push(custom ? createElement(Fragment, { key }, custom) : createElement(name === "br" ? "br" : name, { key }));
    } else if (custom) {
      out.push(cloneElement(custom, { key }, inner));
    } else if (["b", "i", "strong", "em", "u"].includes(name)) {
      out.push(createElement(name, { key }, inner));
    } else {
      out.push(inner);
    }
    last = offset + match.length;
    return match;
  });
  if (last < str.length) out.push(str.slice(last));
  return createElement(Fragment, null, ...out);
};

export { LANGUAGE_CODES };
