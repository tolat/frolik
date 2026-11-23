// true: the app's buttons etc. follow each user's dominant category colour.
// false: everyone gets the default in index.css (the original blue).
export const FOLLOW_COLOUR_WHEEL = false;

// The app's primary action colour (buttons, links, toggles, the active nav
// tab) comes from CSS variables on :root (index.css). By default it's the
// original blue; once a user has outings it follows the dominant colour of
// their colour wheel: the category they've done the most outings in.
//
// The category colours are pastels (fine for rings and stripes, but white
// text on them is unreadable), so each shade is the same hue darkened just
// enough to hit a contrast ratio (WCAG) against white.

const parseRgb = (color) => {
  const m = String(color || "").match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) return m.slice(1, 4).map(Number);
  const h = String(color || "").match(/^#([0-9a-f]{6})$/i);
  return h ? [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16)) : null;
};

const luminance = ([r, g, b]) => {
  const ch = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const hslToRgb = (h, s, l) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
};

const toHsl = (rgb) => {
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  const l = (max + min) / 2;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  return [h, s, l];
};

// Same hue, darkened until it reaches `target` contrast against `against`.
// Saturation is softened: pastels are near-100% saturated in HSL, and
// darkening them as-is turned out neon (lime green, pure red).
export const darkenTo = (color, target, against = [255, 255, 255]) => {
  const rgb = parseRgb(color);
  if (!rgb) return null;
  if (contrast(rgb, against) >= target) return rgb;
  let [h, s, l] = toHsl(rgb);
  const soft = Math.min(s, 0.6);
  let out = rgb;
  while (l > 0.05 && contrast(out, against) < target) {
    l -= 0.01;
    out = hslToRgb(h, soft, l);
  }
  return out;
};

// Category tabs: the category colour as text on the page background
const PAGE_BG = [244, 246, 250];
export const inkFor = (color, target) => {
  const out = darkenTo(color, target, PAGE_BG);
  return out ? `rgb(${out.join(", ")})` : color;
};

const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const mixWhite = (rgb, amount) => rgb.map((v) => Math.round(v + (255 - v) * amount));

// Mix a colour into the dark-mode surface (index.css --surface, dark)
const DARK_SURFACE = [26, 29, 37];
const mixDark = (rgb, amount) =>
  rgb.map((v, i) => Math.round(DARK_SURFACE[i] + (v - DARK_SURFACE[i]) * amount));

// The CSS variables for one primary colour. In dark mode the soft tint is a
// deep, muted version of the colour (a pale wash glared on the dark screen)
// and accents use the bright colour itself, so text on the dark reads.
export const primaryShades = (color) => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  if (dark) {
    const rgb = parseRgb(color);
    if (!rgb) return null;
    return {
      "--primary": hex(rgb),
      "--primary-rgb": "0, 0, 0",
      "--primary-strong": hex(mixWhite(rgb, 0.2)),
      "--primary-strong-rgb": "0, 0, 0",
      "--primary-light": hex(mixWhite(rgb, 0.35)),
      // A richer (darkened) version of the colour, sunk into the dark surface
      "--primary-soft": hex(mixDark(darkenTo(color, 3) || rgb, 0.42)),
    };
  }
  const base = darkenTo(color, 3); // white text on it reads
  const strong = darkenTo(color, 4.5); // text-on-white, pressed states
  if (!base || !strong) return null;
  return {
    "--primary": hex(base),
    "--primary-rgb": base.join(", "),
    "--primary-strong": hex(strong),
    "--primary-strong-rgb": strong.join(", "),
    "--primary-light": hex(mixWhite(base, 0.25)),
    "--primary-soft": hex(mixWhite(parseRgb(color), 0.75)),
  };
};

// The category the user has done the most outings in (null: no outings)
export const dominantCategory = (user, categoryColorMap) => {
  if (!user?.outings?.length || !categoryColorMap) return null;
  const counts = {};
  for (const o of user.outings) {
    const c = o?.activity?.category;
    if (c && categoryColorMap[c]) counts[c] = (counts[c] || 0) + 1;
  }
  // Ties go to the category that comes first (the wheel's order)
  let best = null;
  for (const c of Object.keys(categoryColorMap)) {
    if (counts[c] && (!best || counts[c] > counts[best])) best = c;
  }
  return best;
};

const THEME_VARS = [
  "--primary",
  "--primary-rgb",
  "--primary-strong",
  "--primary-strong-rgb",
  "--primary-light",
  "--primary-soft",
];

// Set (or, with no colour, clear back to index.css) the primary colour
export const applyPrimaryColor = (color) => {
  const root = document.documentElement.style;
  const shades = color ? primaryShades(color) : null;
  THEME_VARS.forEach((v) =>
    shades ? root.setProperty(v, shades[v]) : root.removeProperty(v)
  );
};
