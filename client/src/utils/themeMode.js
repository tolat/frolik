// Light / dark mode (Settings → Dark mode).
//
// The choice is kept on this device (localStorage) and shown by
// html[data-theme="dark"], which switches every colour variable in
// index.css. public/index.html applies the saved choice before the app
// loads, so a dark-mode user never sees a white flash.
const KEY = "frolik:theme";

// Status bar / browser chrome colour to match the page background
const BAR = { light: "#f4f6fa", dark: "#0f1116" };

export const getThemeMode = () => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const applyThemeMode = (mode) => {
  const root = document.documentElement;
  if (mode === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", BAR[mode] || BAR.light));
  document
    .querySelectorAll('meta[name="color-scheme"]')
    .forEach((m) => m.setAttribute("content", mode === "dark" ? "dark" : "light"));
};

export const setThemeMode = (mode) => {
  try {
    localStorage.setItem(KEY, mode);
  } catch {}
  applyThemeMode(mode);
};
