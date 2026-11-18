// Languages Frolik ships with. `name` is how the language names itself.
// Keep in step with utils/i18n.js LANGS on the server.
export const LANGUAGES = [
  { code: "en", name: "English", english: "English" },
  { code: "es", name: "Español", english: "Spanish" },
  { code: "fr", name: "Français", english: "French" },
  { code: "de", name: "Deutsch", english: "German" },
  { code: "pt", name: "Português", english: "Portuguese" },
  { code: "it", name: "Italiano", english: "Italian" },
  { code: "zh", name: "简体中文", english: "Chinese (Simplified)" },
  { code: "ja", name: "日本語", english: "Japanese" },
  { code: "ko", name: "한국어", english: "Korean" },
  { code: "hi", name: "हिन्दी", english: "Hindi" },
  { code: "ar", name: "العربية", english: "Arabic", dir: "rtl" },
  { code: "ru", name: "Русский", english: "Russian" },
  { code: "nb", name: "Norsk bokmål", english: "Norwegian" },
];

// Other codes browsers use for a language we ship (Norwegian: "no", Nynorsk)
const ALIASES = { no: "nb", nn: "nb" };

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export const normalizeLanguage = (code) => {
  if (!code || typeof code !== "string") return null;
  const raw = code.trim().toLowerCase().split(/[-_]/)[0];
  const base = ALIASES[raw] || raw;
  return LANGUAGE_CODES.includes(base) ? base : null;
};

export const languageDir = (code) =>
  LANGUAGES.find((l) => l.code === code)?.dir || "ltr";
