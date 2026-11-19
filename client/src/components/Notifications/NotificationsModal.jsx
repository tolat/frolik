import OutingNotice from "./OutingNotice";
import { Fragment, useState } from "react";
import ModalPortal from "../Modals/ModalPortal";
import styles from "./styles/NotificationsModal.module.scss";
import { useSelector } from "react-redux";
import sampleNotificationIcon from "../../images/active.png";
import OutingInvite from "./OutingInvite";
import OutingUpdate from "./OutingUpdate";
import FriendRequest from "./FriendRequest";
import FriendRequestUpdate from "./FriendRequestUpdate";
import FriendRemoved from "./FriendRemoved";
import ChatCreated from "./ChatCreated";
import { dateSort, toSorted } from "../../utils/utils";
import ModalHeaderPortal from "../Modals/ModalHeaderPortal";
import PushPrompt from "./PushPrompt";
import { useT } from "../../i18n";

const NotificationsModal = (props) => {
  const { t } = useT();
  const modalState = useSelector((state) => state.modal);
  // Rendered as the /alerts page (asPage) or, legacy, inside the slide-in modal
  const modalDisplay =
    props.asPage || modalState.selector === "notifications" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);

  const Wrapper = props.asPage ? Fragment : ModalPortal;

  // All / Unread / Read
  const [filter, setFilter] = useState("all");
  const all = user.notifications || [];
  const unreadCount = all.filter((n) => !n.read).length;
  const shown = all.filter((n) =>
    filter === "unread" ? !n.read : filter === "read" ? !!n.read : true
  );
  const filters = [
    { key: "all", label: t("notifications.filters.all") },
    { key: "unread", label: t("notifications.filters.unread"), count: unreadCount },
    { key: "read", label: t("notifications.filters.read") },
  ];

  return (
    <Wrapper>
      <div
        style={modalStyle}
        className={`${styles.container} ${props.asPage ? styles.pageContainer : ""}`}
      >
        {!props.asPage && (
          <ModalHeaderPortal selector={"notifications"}>{t("notifications.title")}</ModalHeaderPortal>
        )}
        {props.asPage && <PushPrompt />}
        <div className={styles.filterRow} role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`${styles.filterPill} ${filter === f.key ? styles.filterPillActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.count ? <span className={styles.filterCount}>{f.count}</span> : null}
            </button>
          ))}
        </div>
        {shown[0] ? (
          toSorted(shown, (a, b) =>
            dateSort(b.created, a.created)
          ).map((n) => {
            switch (n.type) {
              case "outing-invite":
                return (
                  <OutingInvite
                    header={t("notifications.headers.outingInvite")}
                    key={n.id}
                    notification={n}
                    canDecline={true}
                  />
                );
              case "outing-invite-update":
                return (
                  <OutingUpdate
                    header={
                      n.status === "denied"
                        ? t("notifications.headers.inviteDenied")
                        : t("notifications.headers.inviteAccepted")
                    }
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-leave":
                return (
                  <OutingUpdate
                    header={t("notifications.headers.outingLeft")}
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-join":
                return (
                  <OutingUpdate
                    header={t("notifications.headers.outingJoined")}
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-complete":
                return (
                  <OutingInvite
                    header={t("notifications.headers.outingCompleted")}
                    key={n.id}
                    notification={n}
                    showOuting={true}
                  />
                );
              case "outing-marked-complete":
                return (
                  <OutingUpdate
                    header={t("notifications.headers.outingMarkedComplete")}
                    footer={t("notifications.footers.markComplete")}
                    key={n.id}
                    notification={n}
                  />
                );
              case "friend-request":
                return <FriendRequest key={n.id} notification={n} />;
              case "friend-request-update":
                return (
                  <FriendRequestUpdate key={n.id} notification={n} />
                );
              case "friend-removed":
                return <FriendRemoved key={n.id} notification={n} />;
              case "chat-created":
                return <ChatCreated key={n.id} notification={n} />;
              case "outing-notice":
                return <OutingNotice key={n.id} notification={n} />;

              default:
                return null;
            }
          })
        ) : (
          <div className={styles.nothingContainer}>
            <img
              src={sampleNotificationIcon}
              className={styles.nothingIcon}
              alt={t("notifications.empty.iconAlt")}
            />
            <div className={styles.nothingRightContainer}>
              <div className={styles.nothingRightHeader}>
                {filter === "all"
                  ? t("notifications.empty.title")
                  : t(`notifications.empty.${filter}Title`)}
              </div>
              <div>
                {filter === "all"
                  ? t("notifications.empty.body")
                  : t(`notifications.empty.${filter}Body`)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default NotificationsModal;
