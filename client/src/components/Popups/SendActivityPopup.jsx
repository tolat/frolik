import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmptyPopup from "./EmptyPopup";
import UserIcon from "../UI/UserIcon";
import styles from "./styles/SendActivityPopup.module.scss";
import { sendActivityToFriend } from "../../utils/shareActivity";

// "Send to a friend": pick a friend, the activity is posted in your chat with
// them (an existing one is reused) and that chat opens.
const SendActivityPopup = () => {
  const user = useSelector((state) => state.auth.user);
  const activity = useSelector((state) => state.popup.sendActivity);
  const isOpen = useSelector((state) => state.popup.selector === "send-activity");
  const [query, setQuery] = useState("");
  const [sendingTo, setSendingTo] = useState(null);
  // The picker opens under the finger that tapped "Send to a friend"; ignore
  // taps for a moment so that same touch can't also pick a friend
  const openedAt = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSendingTo(null);
      openedAt.current = Date.now();
    }
  }, [isOpen]);

  const friends = (user?.friends || []).filter((f) => f?._id);
  const q = query.trim().toLowerCase();
  const shown = q
    ? friends.filter((f) =>
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(q)
      )
    : friends;

  const send = (friend) => {
    if (sendingTo || Date.now() - openedAt.current < 400) return;
    setSendingTo(friend._id);
    sendActivityToFriend(friend, activity, (ok) => {
      if (!ok) setSendingTo(null);
    });
  };

  return (
    <EmptyPopup selector="send-activity">
      <div className={styles.container}>
        <div className={styles.header}>Send to a friend</div>
        {activity ? (
          <div className={styles.subheader}>{activity.name}</div>
        ) : null}
        {friends.length > 6 ? (
          <input
            className={styles.search}
            placeholder="Search friends…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        ) : null}
        <div className={styles.list}>
          {friends.length === 0 ? (
            <div className={styles.empty}>
              Add friends to send them activities. You can add someone after
              you've completed an outing together.
            </div>
          ) : shown.length === 0 ? (
            <div className={styles.empty}>No friends match "{query}".</div>
          ) : (
            shown.map((f) => (
              <button
                key={f._id}
                type="button"
                className={styles.friend}
                onClick={() => send(f)}
                disabled={!!sendingTo}
              >
                <UserIcon user={f} sizeInRem={4.4} borderSizeInRem={0.3} />
                <span className={styles.friendText}>
                  <span className={styles.friendName}>
                    {f.first_name} {f.last_name}
                  </span>
                  {f.location ? (
                    <span className={styles.friendCity}>{f.location}</span>
                  ) : null}
                </span>
                <span className={styles.sendLabel}>
                  {sendingTo === f._id ? "Sending…" : "Send"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </EmptyPopup>
  );
};

export default SendActivityPopup;
