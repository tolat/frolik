import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyPopup from "./EmptyPopup";
import FriendCard from "../UI/FriendCard";
import CircleAction from "../UI/CircleAction";
import { popupActions } from "../../store/popup-slice";
import { authActions } from "../../store/auth-slice";
import {
  dismissNotification,
  fetchMatchedUsers,
  sendFriendRequest,
} from "../../utils/data-fetch";
import { friendAccess, incomingFriendRequest } from "../../utils/friendAccess";
import addFriend from "../../images/add-friend.png";
import sentMail from "../../images/sent-mail.png";
import styles from "./styles/AddOutingFriendsDrawer.module.scss";
import { useT } from "../../i18n";

const seenKey = (userID, outingID) =>
  `frolik:friend-prompt:${userID}:${outingID}`;
const wasSeen = (key) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};
const markSeen = (key) => {
  try {
    localStorage.setItem(key, "1");
  } catch {}
};

// After an Outing is completed: a drawer listing the members you can now add
// as friends (see utils/friendAccess.js). Opens by itself the first time the
// completed Outing is on screen (right after the last member marks it
// completed, or later from the Alert / Outings list), once per device.
const AddOutingFriendsDrawer = ({ outing, visible }) => {
  const dispatch = useDispatch();
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const selector = `add-friends-${outing?._id}`;
  const completed = !!outing?.date_completed;

  // Members this Outing lets you add (judged on this Outing alone)
  const candidates = useMemo(() => {
    if (!completed || !user) return [];
    const scoped = { ...user, outings: [outing] };
    return (outing.users || []).filter(
      (m) => m?._id && friendAccess(scoped, m).canAddFriend
    );
  }, [completed, outing, user]);

  // Keep the list steady while the drawer is open (people you've just
  // requested stay, showing Requested)
  const [shownList, setShownList] = useState([]);
  const requestedIDs = new Set((user?.friend_requests || []).map(String));
  const pending = candidates.filter((m) => !requestedIDs.has(String(m._id)));

  useEffect(() => {
    if (!visible || !completed || !user || !pending.length) return;
    const key = seenKey(user._id, outing._id);
    if (wasSeen(key)) return;
    markSeen(key);
    setShownList(candidates);
    dispatch(popupActions.showPopup(selector));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, completed, pending.length, outing?._id]);

  // Someone who already asked you: Accept their request instead
  const onAccept = (request) =>
    dismissNotification(
      user,
      request,
      (newUser) => {
        dispatch(authActions.setUser(newUser));
        fetchMatchedUsers(newUser);
      },
      "accepted"
    );

  const onAdd = (member) => {
    sendFriendRequest(user, member, (response) => {
      if (response?.user) {
        dispatch(authActions.setUser({ ...response.user, friends: user.friends }));
      }
    });
  };

  if (!completed) return null;

  return (
    <EmptyPopup selector={selector} label={t("friendsDrawer.label")}>
      <div className={styles.container}>
        <h2 className={styles.header}>{t("friendsDrawer.header")}</h2>
        <p className={styles.subtitle}>
          {t("friendsDrawer.subtitle")}
        </p>
        <div className={styles.list}>
          {shownList.map((m) => {
            const requested = requestedIDs.has(String(m._id));
            const incoming = incomingFriendRequest(user, m);
            const isFriend = (user.friends || []).some(
              (f) => String(f._id || f) === String(m._id)
            );
            return (
              <FriendCard
                key={m._id}
                user={m}
                small={true}
                noShadow={true}
                buttons={
                  isFriend ? (
                    <CircleAction
                      compact
                      icon={addFriend}
                      label={t("friendsDrawer.friends")}
                      tone="secondary"
                    />
                  ) : incoming ? (
                    <CircleAction
                      compact
                      icon={addFriend}
                      label={t("notifications.actions.accept")}
                      onClick={() => onAccept(incoming)}
                    />
                  ) : requested ? (
                    <CircleAction
                      compact
                      icon={sentMail}
                      label={t("friendsDrawer.requested")}
                      tone="secondary"
                    />
                  ) : (
                    <CircleAction
                      compact
                      icon={addFriend}
                      label={t("friendsDrawer.addFriend")}
                      onClick={() => onAdd(m)}
                    />
                  )
                }
              />
            );
          })}
        </div>
        <button
          type="button"
          className={styles.doneButton}
          onClick={() => dispatch(popupActions.hidePopup())}
        >
          {t("friendsDrawer.done")}
        </button>
      </div>
    </EmptyPopup>
  );
};

export default AddOutingFriendsDrawer;
