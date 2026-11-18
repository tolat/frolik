// Location search + reverse geocoding, proxied through the server so the
// client never talks to (or holds keys for) a geocoding provider directly.
//
// Providers (no API key needed):
//   search  → Open-Meteo geocoding (GeoNames data, built for autocomplete)
//   reverse → OpenStreetMap Nominatim (usage policy: identify the app, ≤1 req/s)
// To switch to Google later, replace searchPlaces/reversePlace below.
const express = require("express");
const rateLimit = require("express-rate-limit");
const { tryCatch } = require("../utils/middleware");

const router = express.Router({ mergeParams: true });

// Unauthenticated (used during sign-up), so keep it rate limited
router.use(
  rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false })
);

const PROVIDER_TIMEOUT_MS = 6000;
const USER_AGENT = `frolik/1.0 (${process.env.SERVER || "frolik"})`;
const cache = new Map(); // tiny LRU so repeated keystrokes don't re-query
const cached = async (key, fn) => {
  if (cache.has(key)) {
    const v = cache.get(key);
    cache.delete(key);
    cache.set(key, v);
    return v;
  }
  const v = await fn();
  cache.set(key, v);
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return v;
};

// Stored label stays "City, CC" (e.g. "Vancouver, CA") — the format the app
// has always used for matching activities; coordinates carry the precision.
const toPlace = ({ name, countryCode, region, country, lat, lng }) => ({
  label: `${name}, ${String(countryCode || "").toUpperCase()}`,
  detail: [region, country].filter(Boolean).join(", "),
  lat: Math.round(lat * 1e4) / 1e4,
  lng: Math.round(lng * 1e4) / 1e4,
});

const searchPlaces = async (q) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    q
  )}&count=8&language=en&format=json`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS), // providers can be slow
  });
  if (!res.ok) throw new Error(`search provider ${res.status}`);
  const data = await res.json();
  const seen = new Set();
  return (data.results || [])
    .filter((r) => r.country_code && Number.isFinite(r.latitude))
    .map((r) =>
      toPlace({
        name: r.name,
        countryCode: r.country_code,
        region: r.admin1,
        country: r.country,
        lat: r.latitude,
        lng: r.longitude,
      })
    )
    .filter((p) => {
      const k = `${p.label}|${p.detail}`;
      return !seen.has(k) && seen.add(k);
    });
};

// Reverse geocoding: ask two free OpenStreetMap-based services at once and use
// whichever answers first (Nominatim alone can be slow, or throttle requests
// from shared hosting IPs — which made the first lookup fail in production).
const reverseNominatim = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&accept-language=en&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const a = (await res.json()).address || {};
  const name = a.city || a.town || a.village || a.municipality || a.county;
  if (!name || !a.country_code) throw new Error("nominatim: no city");
  return toPlace({
    name,
    countryCode: a.country_code,
    region: a.state || a.province,
    country: a.country,
    lat,
    lng,
  });
};

const reversePhoton = async (lat, lng) => {
  const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=en&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`photon ${res.status}`);
  const p = (await res.json()).features?.[0]?.properties || {};
  const isPlace = ["city", "town", "village", "locality"].includes(p.type);
  const name = p.city || (isPlace ? p.name : null) || p.county || p.district;
  if (!name || !p.countrycode) throw new Error("photon: no city");
  return toPlace({
    name,
    countryCode: p.countrycode,
    region: p.state,
    country: p.country,
    lat,
    lng,
  });
};

// Both run in parallel; Photon's "city" is preferred (London rather than
// "City of Westminster", Tokyo rather than a ward), Nominatim is the fallback.
const reversePlace = async (lat, lng) => {
  const nominatim = reverseNominatim(lat, lng).then(
    (place) => ({ place }),
    (error) => ({ error })
  );
  try {
    return await reversePhoton(lat, lng);
  } catch (photonError) {
    const { place, error } = await nominatim;
    if (place) return place;
    console.error(
      "[geo reverse] all providers failed:",
      photonError.message,
      ";",
      error.message
    );
    return null;
  }
};

router.get(
  "/search",
  tryCatch(async (req, res) => {
    const q = String(req.query.q || "").trim().slice(0, 80);
    if (q.length < 2) return res.send({ places: [] });
    try {
      const places = await cached(`s:${q.toLowerCase()}`, () => searchPlaces(q));
      res.send({ places });
    } catch (err) {
      console.error("[geo search]", err.message);
      res.status(502).send({ places: [] });
    }
  })
);

router.get(
  "/reverse",
  tryCatch(async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!(Math.abs(lat) <= 90 && Math.abs(lng) <= 180)) {
      return res.status(406).send({ header: req.t("geo.invalidLocation.header"), message: "" });
    }
    // City-level only: round so we never send/keep a precise position
    const rlat = Math.round(lat * 100) / 100;
    const rlng = Math.round(lng * 100) / 100;
    try {
      const place = await cached(`r:${rlat},${rlng}`, () => reversePlace(rlat, rlng));
      if (!place) {
        return res.status(406).send({
          header: req.t("geo.cityNotFound.header"),
          message: req.t("geo.cityNotFound.message"),
        });
      }
      res.send({ place });
    } catch (err) {
      console.error("[geo reverse]", err.message);
      res.status(502).send({
        header: req.t("geo.lookupFailed.header"),
        message: req.t("geo.lookupFailed.message"),
      });
    }
  })
);

module.exports = router;
