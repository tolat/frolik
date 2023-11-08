import ModalPortal from "./ModalPortal";
import styles from "./styles/NotificationsModal.module.scss";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect } from "react";
import { modalActions } from "../../store/modal-slice";
import { fetchOuting } from "../../utils/data-fetch";
import modalStyles from "./styles/SlideInModal.module.scss";
import { hideModal } from "../../store/modal-actions";
import { initializeUserPhotos } from "../../store/data-actions";
import sampleNotificationIcon from "../../images/active.png";
import { dataActions } from "../../store/data-slice";

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

const OutingInvite = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const outingID = props.notification.outing;
  const inviteOutings = useSelector((state) => state.data.inviteOutings);
  const outing = inviteOutings?.find((o) => o._id === outingID);
  const globals = useSelector((state) => state.auth.globals);
  const stripeColor = globals?.categoryColorMap[outing?.activity?.category];

  // Fetch outing from server if is hasn't been fetched
  useEffect(() => {
    const onComplete = (outing) => {
      dispatch(dataActions.addInviteOuting(outing));
      const newOutings = user.outings.concat([outing]);
      const newUser = { ...user, outings: newOutings };
      initializeUserPhotos(newUser);
    };

    if (!outing) {
      fetchOuting(outingID, user, onComplete);
    }
  }, [outingID, user, outing, dispatch]);

  // Show outing modal
  const handleViewOuting = async () => {
    await hideModal();
    dispatch(modalActions.setActiveOuting(outing));
    dispatch(modalActions.setSelector("outing-modal"));
    dispatch(modalActions.showModal());
  };

  return (
    <div className={styles.outingInviteContainer}>
      <div
        style={{ backgroundColor: stripeColor }}
        className={styles.colorStripe}
      ></div>
      <div className={styles.outingInviteInnerContainer}>
        <div className={styles.outingInviteHeader}>
          You have been invited to an outing!
        </div>
        {outing ? (
          <Fragment>
            <div className={styles.outingInviteActivity}>
              Activity: {outing.activity.name}
            </div>
            <div className={styles.outingInviteButtons}>
              <SimpleButton noShadow={true} onClick={handleViewOuting}>
                {" "}
                View Outing
              </SimpleButton>
              <div className={styles.buttonSpacer}></div>
              <SimpleButton
                noShadow={true}
                className={styles.deleteNotification}
              >
                {" "}
                Dismiss
              </SimpleButton>
            </div>
          </Fragment>
        ) : (
          "Loading.."
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
