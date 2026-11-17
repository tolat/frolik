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
export const currentPlace = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location isn't available on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // Round to ~1 km on the device: only the city is needed
          const lat = Math.round(coords.latitude * 100) / 100;
          const lng = Math.round(coords.longitude * 100) / 100;
          const res = await fetch(`${getServer()}/geo/reverse?lat=${lat}&lng=${lng}`);
          const body = await res.json();
          if (!res.ok || !body.place) throw new Error(body.header || "Couldn't find your city.");
          resolve(body.place);
        } catch (err) {
          reject(err);
        }
      },
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? "Location permission was denied. Search for your city instead."
              : "Couldn't get your location. Search for your city instead."
          )
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  });

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
