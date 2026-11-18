import OutingNotice from "./OutingNotice";
import { Fragment } from "react";
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
        {user.notifications[0] ? (
          toSorted(user.notifications, (a, b) =>
            dateSort(b.created, a.created)
          ).map((n) => {
            switch (n.type) {
              case "outing-invite":
                return (
                  <OutingInvite
                    header={t("notifications.headers.outingInvite")}
                    key={n.id}
                    notification={n}
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
              <div className={styles.nothingRightHeader}>{t("notifications.empty.title")}</div>
              <div>{t("notifications.empty.body")}</div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default NotificationsModal;
