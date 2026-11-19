import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/AlertTile.module.scss";
import UserIcon from "../UI/UserIcon";
import TintedIcon from "../UI/TintedIcon";
import balloonIcon from "../../images/air-balloon-blue.png";
import { markNotificationsRead } from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { useT } from "../../i18n";

// One alert on the Alerts page. Every alert is the same height: picture on
// the left (the person, or the outing's category colour), a one-line title,
// a one-line detail and the time; an unread dot until it's opened.
//
// Tapping it opens what it's about (onOpen) and marks it read. `actions`
// are the few decisions that can be made right here (Accept / Deny a friend
// request, Decline an invite); they don't open anything.
//
// Titles reuse the old headers ("…was joined by:"), so the colon goes.
const stripColon = (s) => String(s || "").replace(/\s*[:：]\s*$/, "");

const AlertTile = ({ notification, title, detail, person, color, onOpen, actions, tag }) => {
  const dispatch = useDispatch();
  const { formatDate } = useT();
  const user = useSelector((state) => state.auth.user);
  const unread = !notification.read;

  const markRead = () => {
    if (!unread) return;
    // Optimistic: the dot goes at once; the server's copy follows
    dispatch(
      authActions.setUser({
        ...user,
        notifications: user.notifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        ),
      })
    );
    markNotificationsRead(user, [notification.id], (u) => dispatch(authActions.setUser(u)));
  };

  const open = () => {
    markRead();
    onOpen?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.tile} ${unread ? styles.unread : ""}`}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
    >
      <div className={styles.picture}>
        {person ? (
          <UserIcon user={person} sizeInRem="4.6" borderSizeInRem="0.3" />
        ) : (
          <span className={styles.badge} style={{ backgroundColor: color || "var(--primary-soft)" }}>
            <TintedIcon src={balloonIcon} className={styles.badgeIcon} color="#1b1d24" />
          </span>
        )}
      </div>
      <div className={styles.text}>
        <div className={styles.title}>{stripColon(title)}</div>
        <div className={styles.detail}>{detail}</div>
        <div className={styles.time}>
          {formatDate(notification.created, { dateStyle: "medium", timeStyle: "short" })}
        </div>
      </div>
      {actions?.length ? (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className={`${styles.action} ${a.primary ? styles.actionPrimary : ""}`}
              // No separate mark-read: the server marks the alert answered
              // and read (sending both at once raced and failed)
              onClick={() => a.onClick()}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* An answered request / invite: what was decided */}
          {tag ? <span className={styles.tag}>{tag}</span> : null}
          {onOpen ? (
            <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          ) : null}
        </>
      )}
      {unread ? <span className={styles.dot} aria-hidden="true" /> : null}
    </div>
  );
};

export default AlertTile;
