// Keeps the database's category colours in line with seeds/globals.js, so a
// colour change ships with a deploy (the globals document is only written
// when the database is first seeded). Runs on server start (server.js) and
// does nothing when they already match.
const Globals = require("../models/globals");
const { categoryColorMap, appInstallVersion } = require("../seeds/globals");

const syncCategoryColors = async () => {
  const globals = await Globals.findOne({});
  if (!globals) return false;
  const current = globals.categoryColorMap || {};
  const changed = Object.keys(categoryColorMap).filter(
    (k) => current[k] !== categoryColorMap[k]
  );
  if (!changed.length) return false;
  // Same keys (and order) as before; only the colours change
  globals.categoryColorMap = { ...current, ...categoryColorMap };
  globals.markModified("categoryColorMap");
  await globals.save();
  console.log(`[globals] category colours updated: ${changed.join(", ")}`);
  return true;
};

// The installed-app version (see seeds/globals.js) ships the same way
const syncAppInstallVersion = async () => {
  const globals = await Globals.findOne({});
  if (!globals || globals.appInstallVersion === appInstallVersion) return false;
  await Globals.updateOne({ _id: globals._id }, { $set: { appInstallVersion } });
  console.log(`[globals] app install version -> ${appInstallVersion}`);
  return true;
};

const startGlobalsSync = () => {
  setTimeout(() => {
    syncCategoryColors().catch((err) =>
      console.error("[globals] colour sync failed:", err.message)
    );
    syncAppInstallVersion().catch((err) =>
      console.error("[globals] app version sync failed:", err.message)
    );
  }, 15 * 1000);
};

module.exports = { syncCategoryColors, syncAppInstallVersion, startGlobalsSync };
