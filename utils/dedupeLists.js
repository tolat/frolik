// Removes repeated ids from lists that should hold each person (or outing,
// or chat) once. Answering the same friend request or outing invite twice
// (a double tap, or the alert and the drawer both) used to add the same
// entry again, e.g. one friend listed 8 times. Runs on server start
// (server.js); only touches documents that actually have repeats, and keeps
// the first of each in its original place.
const User = require("../models/user");
const Outing = require("../models/outing");

const hasRepeats = (field) => ({
  $expr: {
    $ne: [
      { $size: { $ifNull: [`$${field}`, []] } },
      { $size: { $setUnion: [{ $ifNull: [`$${field}`, []] }, []] } },
    ],
  },
});

const unique = (list) => {
  const seen = new Set();
  return list.filter((id) => {
    const key = String(id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const dedupe = async (Model, field) => {
  const docs = await Model.find(hasRepeats(field), { [field]: 1 }).lean();
  for (const doc of docs) {
    await Model.updateOne({ _id: doc._id }, { $set: { [field]: unique(doc[field]) } });
  }
  return docs.length;
};

const dedupeLists = async () => {
  const fixed = {};
  for (const field of ["friends", "friend_requests", "outings", "chats"]) {
    const n = await dedupe(User, field);
    if (n) fixed[`users.${field}`] = n;
  }
  for (const field of ["users", "invited"]) {
    const n = await dedupe(Outing, field);
    if (n) fixed[`outings.${field}`] = n;
  }
  return fixed;
};

const startDedupeLists = () => {
  setTimeout(() => {
    dedupeLists()
      .then((fixed) => {
        if (Object.keys(fixed).length) console.log("[dedupe] removed repeats:", JSON.stringify(fixed));
      })
      .catch((err) => console.error("[dedupe] failed:", err.message));
  }, 25 * 1000);
};

module.exports = { dedupeLists, startDedupeLists };
