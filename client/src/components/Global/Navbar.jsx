import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import NavButton from "../UI/NavButton";
import logo from "../../images/air-balloon.png";
import bell from "../../images/bell3.png";
import { hideModal } from "../../store/modal-actions";
import NotificationsModal from "../Notifications/NotificationsModal";
import { modalActions } from "../../store/modal-slice";
import OutingModal from "../Modals/OutingModal";
import ChatModal from "../Modals/ChatModal";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { Fragment } from "react";
import ProfileViewerModal from "../Modals/ProfileViewerModal";
import profileIcon from "../../images/account.png";
import chatIcon from "../../images/chat.png";
import feedIcon from "../../images/post2.png";
import { getTotalUnreadMessages } from "../../utils/utils";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  const modalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getTotalUnreadMessages(user);
  const makeActive = (navData) =>
    navData.isActive ? styles.activeLink : "none";

  const handleShowNotifications = async () => {
    if (modalState.selector && modalState.selector !== "notifications") {
      await hideModal();
    }
    dispatch(modalActions.setSelector("notifications"));
    dispatch(modalActions.showModal());
  };

  const tooManyOutingsMessage = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <b>You can only have up to 5 pending outings at a time.</b> <br />
      Either complete or delete some outings before trying to create another
      one. You can view your outings any time in the 'Profile' page by clicking
      the following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
    </div>
  );

  // Navigate to profile page if too many outings
  const handleHideWarning = () => {
    dispatch(popupActions.hidePopup());
  };

  return (
    <div className={styles.header}>
      {user && (
        <Fragment>
          <NotificationsModal />
          <ChatModal />
          <OutingModal />
          <ProfileViewerModal />
          <WarningPopup
            selector={"too-many-outings"}
            header={"You have too many Pending Outings!"}
            message={tooManyOutingsMessage}
            ok={"OK"}
            okClick={handleHideWarning}
          />
        </Fragment>
      )}

      <div className={styles.innerContainer}>
        {authState.isAuthenticated ? (
          <div className={styles.navItems}>
            <NavButton
              onClick={handleShowNotifications}
              icon={bell}
              className={`${styles.navButton} ${styles.notificationsHover}`}
            >
              {user && user.notifications.length > 0 ? (
                <div className={styles.notificationBadge}>
                  {user && user.notifications.length}
                </div>
              ) : null}
            </NavButton>
            <NavLink className={(navData) => makeActive(navData)} to="/go">
              <NavButton
                icon={logo}
                className={`${styles.navButton} ${styles.createOutingHover}`}
              />
            </NavLink>
            <NavLink className={(navData) => makeActive(navData)} to="/profile">
              <NavButton
                icon={profileIcon}
                className={`${styles.navButton} ${styles.profileHover}`}
              />
            </NavLink>
            <NavLink className={(navData) => makeActive(navData)} to="/social">
              <NavButton
                icon={feedIcon}
                className={`${styles.navButton} ${styles.socialHover}`}
              />
            </NavLink>
            <NavLink className={(navData) => makeActive(navData)} to="/chat">
              <NavButton
                icon={chatIcon}
                className={`${styles.navButton} ${styles.chatsHover}`}
              >
                {unreadChatMessages > 0 ? (
                  <div className={styles.notificationBadge}>
                    {unreadChatMessages > 0 && unreadChatMessages}
                  </div>
                ) : null}
              </NavButton>
            </NavLink>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
