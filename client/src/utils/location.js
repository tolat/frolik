import { getServer } from "./env-utils";

// Labels the user actually picked from geocoding results (or already had),
// with their coordinates. Validators accept only these, and the save calls
// attach the coordinates. Keyed by the label shown in the input.
const confirmed = new Map();

export const confirmLocation = (label, geo = null) => {
  if (label) confirmed.set(label, geo);
};

export const isConfirmedLocation = (label) => !!label && confirmed.has(label);

// {lat, lng} for a confirmed label, or null
export const getLocationGeo = (label) => confirmed.get(label) || null;

// GeoJSON point from the server → {lat, lng}
export const geoFromPoint = (point) =>
  point?.coordinates?.length === 2
    ? { lat: point.coordinates[1], lng: point.coordinates[0] }
    : null;

export const searchPlaces = async (q, signal) => {
  const res = await fetch(`${getServer()}/geo/search?q=${encodeURIComponent(q)}`, {
    signal,
  });
  if (!res.ok) throw new Error("search failed");
  return (await res.json()).places || [];
};

// Ask the browser for the device position (needs the user's permission),
// then look up the city on the server.
//
// On iOS the first position request after the app opens (or right after
// granting permission) usually fails at once with "position unavailable"
// while location services warm up; the second tap worked. So instead of a
// one-shot request we *watch* for the first fix and ignore those transient
// errors until a fix arrives or the time runs out. Only a denial stops early.
const getFirstFix = (timeoutMs = 20000) =>
  new Promise((resolve, reject) => {
    let lastError = null;
    let done = false;
    let watchID = null;
    const finish = (fn, value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (watchID !== null) navigator.geolocation.clearWatch(watchID);
      fn(value);
    };
    const timer = setTimeout(
      () => finish(reject, lastError || { code: 3 }),
      timeoutMs
    );
    watchID = navigator.geolocation.watchPosition(
      (position) => finish(resolve, position),
      (err) => {
        lastError = err;
        if (err?.code === 1) finish(reject, err); // denied
      },
      { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: timeoutMs }
    );
    if (done) navigator.geolocation.clearWatch(watchID);
  });

const getPosition = (options) =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );

const positionError = (err) =>
  new Error(
    err?.code === 1
      ? "Location permission was denied. Search for your city instead."
      : "Couldn't get your location. Search for your city instead."
  );

// One retry on a network blip *or* a server error (the geocoding providers
// can time out on a cold first request); a 406 (no city here) is final.
const reverseLookup = async (lat, lng) => {
  const url = `${getServer()}/geo/reverse?lat=${lat}&lng=${lng}`;
  const attempt = async () => {
    const res = await fetch(url);
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.place) return body.place;
    const err = new Error(body.header || "Couldn't find your city.");
    err.final = res.status === 406;
    throw err;
  };
  try {
    return await attempt();
  } catch (err) {
    if (err.final) throw err;
    await new Promise((r) => setTimeout(r, 600));
    return attempt();
  }
};

export const currentPlace = async () => {
  if (!navigator.geolocation) {
    throw new Error("Location isn't available on this device.");
  }
  let position;
  try {
    position = await getFirstFix(20000);
  } catch (err) {
    if (err?.code === 1) throw positionError(err); // denied: don't retry
    try {
      position = await getPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch (retryErr) {
      throw positionError(retryErr);
    }
  }
  // Round to ~1 km on the device: only the city is needed
  const lat = Math.round(position.coords.latitude * 100) / 100;
  const lng = Math.round(position.coords.longitude * 100) / 100;
  return reverseLookup(lat, lng);
};

// Save location and/or the auto-location setting for the logged-in user.
// Returns { location, location_geo, auto_location } from the server.
export const saveLocation = async (userID, body) => {
  const res = await fetch(`${getServer()}/user/${userID}/location`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Couldn't update your location.");
  return data;
};

// Is location permission already granted? (never prompts)
const locationPermissionGranted = async () => {
  try {
    const status = await navigator.permissions?.query({ name: "geolocation" });
    return status?.state === "granted";
  } catch {
    return false;
  }
};

const AUTO_CHECK_KEY = "frolik:lastAutoLocation";
const AUTO_CHECK_EVERY_MS = 30 * 60 * 1000;

const distanceKm = (a, b) => {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// "Keep my location up to date": on app open / return to the app, quietly
// refresh the user's city — only if they turned it on, only where location
// permission is already granted (never prompts), at most every 30 minutes,
// and only saves when the city actually changed. Returns the update or null.
export const autoUpdateLocation = async (user, { force = false } = {}) => {
  if (!user?._id || !user.auto_location) return null;
  try {
    const last = Number(localStorage.getItem(AUTO_CHECK_KEY)) || 0;
    if (!force && Date.now() - last < AUTO_CHECK_EVERY_MS) return null;
  } catch {}
  if (!(await locationPermissionGranted())) return null;

  try {
    localStorage.setItem(AUTO_CHECK_KEY, String(Date.now()));
  } catch {}

  const place = await currentPlace();
  const current = geoFromPoint(user.location_geo);
  const moved =
    place.label !== user.location ||
    !current ||
    distanceKm(current, { lat: place.lat, lng: place.lng }) > 5;
  if (!moved) return null;

  confirmLocation(place.label, { lat: place.lat, lng: place.lng });
  return saveLocation(user._id, {
    location: place.label,
    location_geo: { lat: place.lat, lng: place.lng },
  });
};
