import ModalPortal from "./ModalPortal";
import styles from "./styles/NotificationsModal.module.scss";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import OutingModal from "./OutingModal";
import { useEffect, useState } from "react";
import { modalActions } from "../../store/modal-slice";
import { fetchOuting } from "../../utils/data-fetch";
import modalStyles from "./styles/SlideInModal.module.scss";
import { hideModal } from "../../store/modal-actions";

const NotificationsModal = (props) => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "notifications" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);
  const [activeOuting, setActiveOuting] = useState(false);

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
      <OutingModal showInfoPopup={false} outing={activeOuting} />
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Notifications</div>
        {user.notifications.map((n) => {
          switch (n.type) {
            case "outing-invite":
              return (
                <OutingInvite
                  setActiveOuting={setActiveOuting}
                  notification={n}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </ModalPortal>
  );
};

const OutingInvite = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const outingID = props.notification.outing;
  const [outing, setOuting] = useState(false);
  const globals = useSelector((state) => state.auth.globals);
  const stripeColor = globals?.categoryColorMap[outing?.activity?.category];

  // Fetch outing from server
  useEffect(() => {
    fetchOuting(outingID, user, setOuting);
  }, [outingID, user]);

  // Show outing modal
  const handleViewOuting = async () => {
    await hideModal()
    props.setActiveOuting(outing);
    dispatch(modalActions.setSelector("outing"));
    dispatch(modalActions.showModal());
  };

  return (
    outing && (
      <div className={styles.outingInviteContainer}>
        <div
          style={{ backgroundColor: stripeColor }}
          className={styles.colorStripe}
        ></div>
        <div className={styles.outingInviteInnerContainer}>
          <div className={styles.outingInviteHeader}>
            You have been invited to an outing!
          </div>
          <div className={styles.outingInviteActivity}>
            Activity: {outing.activity.name}
          </div>
          <div className={styles.outingInviteButtons}>
            <SimpleButton noShadow={true} onClick={handleViewOuting}>
              {" "}
              View Outing
            </SimpleButton>
            <div className={styles.buttonSpacer}></div>
            <SimpleButton noShadow={true} className={styles.acceptInvite}>
              {" "}
              Accept Invite
            </SimpleButton>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationsModal;
