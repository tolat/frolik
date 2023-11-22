import ModalPortal from "../Modals/ModalPortal";
import styles from "./styles/NotificationsModal.module.scss";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "../Modals/styles/SlideInModal.module.scss";
import sampleNotificationIcon from "../../images/active.png";
import OutingInvite from "./OutingInvite";
import OutingUpdate from "./OutingUpdate";
import FriendRequest from "./FriendRequest";
import FriendRequestUpdate from "./FriendRequestUpdate";
import FriendRemoved from "./FriendRemoved";
import ChatCreated from "./ChatCreated";
import { dateSort, toSorted } from "../../utils/utils";

const NotificationsModal = (props) => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "notifications" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);

  const onPopupOk = () => {
    dispatch(popupActions.hidePopup());
  };

  const confirmOutingMessage = (
    <div className={styles.confirmOutingMessage}>
      Once you join an outing, it will count towards your 5 pending outings
      limit. If you want to leave the Outing later you can, but it will
      negatively affect your flake rating!
    </div>
  );

  return (
    <ModalPortal>
      <WarningPopup
        selector={"confirm-join-outing"}
        header={"Don't be a flake!"}
        message={confirmOutingMessage}
        ok={"OK"}
        okClick={onPopupOk}
      />
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Alerts</div>
        {user.notifications[0] ? (
          toSorted(user.notifications, (a, b) =>
            dateSort(b.created, a.created)
          ).map((n) => {
            switch (n.type) {
              case "outing-invite":
                return (
                  <OutingInvite
                    header={"You have been invited to an outing!"}
                    key={Math.random()}
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
                    key={Math.random()}
                    notification={n}
                  />
                );
              case "outing-leave":
                return (
                  <OutingUpdate
                    header={"Your Outing was left by:"}
                    key={Math.random()}
                    notification={n}
                  />
                );
              case "outing-join":
                return (
                  <OutingUpdate
                    header={"Your Outing was joined by:"}
                    key={Math.random()}
                    notification={n}
                  />
                );
              case "outing-complete":
                return (
                  <OutingInvite
                    header={"Your Outing was completed!"}
                    key={Math.random()}
                    notification={n}
                    showOuting={true}
                  />
                );
              case "friend-request":
                return <FriendRequest key={Math.random()} notification={n} />;
              case "friend-request-update":
                return (
                  <FriendRequestUpdate key={Math.random()} notification={n} />
                );
              case "friend-removed":
                return <FriendRemoved key={Math.random()} notification={n} />;
              case "chat-created":
                return <ChatCreated key={Math.random()} notification={n} />;

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
    </ModalPortal>
  );
};

export default NotificationsModal;
