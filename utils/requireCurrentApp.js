// Turns away out-of-date copies of the app.
//
// Installed apps from before the Nov 2026 redesign (no skeleton loaders) keep
// running their own cached code: their service worker serves the old app
// shell, so they may never pick up new code by themselves, and none of the
// new code (like the "Update Frolik" drawer) can reach them.
//
// So the server spots them instead, by omission: every request the current
// app makes carries an X-Frolik-Lang header (utils/http-fetch.js and the few
// direct fetches), which the old app never sent. An API request from the
// app's own code without it is answered 406 with a header + message, which
// the old app shows as its standard warning popup, on every request, so it
// can't be used until it's deleted and reinstalled from frolik.ca.
//
// Only the app's own background requests are checked (fetch/XHR): links
// opened from emails, images and the files the app is made of are left alone.

// The app's JSON routes (server.js). /notifications and /image are left out:
// the push service worker uses them.
const GATED = ["/auth", "/user", "/activity", "/data", "/outing", "/geo"];

const isAppRequest = (req) => {
  const dest = req.get("Sec-Fetch-Dest");
  if (dest) return dest === "empty"; // fetch / XMLHttpRequest
  // Older browsers without Sec-Fetch-*: pages and images ask for those types
  return !/text\/html|image\//.test(req.get("Accept") || "");
};

const requireCurrentApp = (req, res, next) => {
  if (req.method === "OPTIONS") return next(); // CORS preflight
  if (!GATED.some((p) => req.path === p || req.path.startsWith(p + "/"))) return next();
  if (req.get("X-Frolik-Lang")) return next();
  if (!isAppRequest(req)) return next();
  res.status(406).send({
    header: req.t("appUpdate.required.header"),
    message: req.t("appUpdate.required.message"),
  });
};

module.exports = { requireCurrentApp };
