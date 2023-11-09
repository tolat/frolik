import ModalPortal from "./ModalPortal";
import styles from "./styles/NotificationsModal.module.scss";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { useDispatch, useSelector } from "react-redux";
import modalStyles from "./styles/SlideInModal.module.scss";
import sampleNotificationIcon from "../../images/active.png";
import OutingInvite from "./OutingInvite";
import OutingUpdate from "./OutingUpdate";

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
        <div className={modalStyles.header}>Notifications</div>
        {user.notifications[0] ? (
          user.notifications.map((n) => {
            switch (n.type) {
              case "outing-invite":
                return <OutingInvite key={Math.random()} notification={n} />;
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
              <div>Your notifications will show up here</div>
            </div>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};

export default NotificationsModal;
