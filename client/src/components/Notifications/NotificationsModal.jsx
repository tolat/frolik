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

const NotificationsModal = (props) => {
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
          <ModalHeaderPortal selector={"notifications"}>Alerts</ModalHeaderPortal>
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
                    header={"You have been invited to an outing!"}
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-invite-update":
                return (
                  <OutingUpdate
                    header={
                      n.status === "denied"
                        ? `Your Outing invite was denied by:`
                        : `Your Outing invite was accepted by: `
                    }
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-leave":
                return (
                  <OutingUpdate
                    header={"Your Outing was left by:"}
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-join":
                return (
                  <OutingUpdate
                    header={"Your Outing was joined by:"}
                    key={n.id}
                    notification={n}
                  />
                );
              case "outing-complete":
                return (
                  <OutingInvite
                    header={"Your Outing was completed!"}
                    key={n.id}
                    notification={n}
                    showOuting={true}
                  />
                );
              case "outing-marked-complete":
                return (
                  <OutingUpdate
                    header={`Your Outing was marked complete by:`}
                    footer={
                      "Your turn to Mark the outing complete when you are done uploading photos!"
                    }
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
              alt="bell"
            />
            <div className={styles.nothingRightContainer}>
              <div className={styles.nothingRightHeader}>Nothing Here!</div>
              <div>Your alerts will show up here</div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default NotificationsModal;
