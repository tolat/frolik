// Who you can add as a friend, and whose profile you can open. Mirrors the
// server check in routes/user.js (/add-friend), which has the final say.
//
// - Add as a friend: you completed an Outing together that one of you
//   created (so it came from a daily match between you). If you were friends
//   before and one of you unfriended the other, only an Outing created after
//   they came up in your daily matches again counts.
// - Open their profile: friends, plus people you've completed an Outing with
//   (unless one of you unfriended the other and you haven't re-qualified).
const idOf = (x) => (x && (x._id || x)) || null;
const same = (a, b) => !!a && !!b && String(idOf(a)) === String(idOf(b));

export const friendAccess = (user, other) => {
  if (!user || !other) {
    return { self: false, isFriend: false, canAddFriend: false, canViewProfile: false, former: null };
  }
  if (same(user, other)) {
    return { self: true, isFriend: false, canAddFriend: false, canViewProfile: true, former: null };
  }

  const isFriend = (user.friends || []).some((f) => same(f, other));
  const former =
    (user.former_friends || []).find((f) => same(f.user, other)) || null;
  // Unfriended: only Outings from after the rematch (or, before we know of
  // one, after the unfriending) count
  const since = former
    ? new Date(
        former.rematched && former.rematched >= former.removed
          ? former.rematched
          : former.removed
      ).getTime()
    : 0;

  const completedTogether = (user.outings || []).filter(
    (o) => o?.date_completed && (o.users || []).some((u) => same(u, other))
  );
  const pairOutings = completedTogether.filter(
    (o) =>
      !o.created_by || same(o.created_by, user) || same(o.created_by, other)
  );
  const qualifies = pairOutings.some(
    (o) => !former || new Date(o.date_created).getTime() >= since
  );

  const canAddFriend = !isFriend && qualifies;
  const canViewProfile =
    isFriend || canAddFriend || (!former && completedTogether.length > 0);

  return { self: false, isFriend, canAddFriend, canViewProfile, former };
};
