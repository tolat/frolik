import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import NavButton from "../UI/NavButton";
import bell from "../../images/bell6.png";
import { hideModal } from "../../store/modal-actions";
import NotificationsModal from "../Notifications/NotificationsModal";
import { modalActions } from "../../store/modal-slice";
import OutingModal from "../Modals/OutingModal";
import ChatModal from "../Modals/ChatModal";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { Fragment, useEffect, useState } from "react";
import ProfileViewerModal from "../Modals/ProfileViewerModal";
import profileIcon from "../../images/account.png";
import profileIconBlue from "../../images/account-blue.png";
import chatIcon from "../../images/chat.png";
import chatIconBlue from "../../images/chat-blue.png";
import feedIcon from "../../images/post2.png";
import feedIconBlue from "../../images/post2-blue.png";
import { getTotalUnreadMessages } from "../../utils/utils";
import PhotoPopup from "../Popups/PhotoPopup";
import logoutIcon from "../../images/logout.png";
import { fetchLogout } from "../../store/auth-actions";
import outingIcon from "../../images/air-balloon.png";
import outingIconBlue from "../../images/air-balloon-blue.png";
import logo from "../../images/frolik2.png";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  const modalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getTotalUnreadMessages(user);
  const location = useLocation();
  const currentUrl = location.pathname;
  const warningMessage = useSelector((state) => state.popup.warningMessage);
  const warningHeader = useSelector((state) => state.popup.warningHeader);
  const [activePage, setActivePage] = useState(false);
  const [masterDisplay, setMasterDisplay] = useState("flex")

  useEffect(() =>{
    if(currentUrl.includes('login')){
      setMasterDisplay("none")
    } else{
      setMasterDisplay("flex")
    }
  },[currentUrl])

  const handleShowNotifications = async () => {
    if (modalState.selector && modalState.selector !== "notifications") {
      await hideModal();
    }
    dispatch(modalActions.setSelector("notifications"));
    dispatch(modalActions.showModal({header: 'Alerts'}));
  };

  const makeActive = (navData, page) => {
    if (navData.isActive) {
      setActivePage(page);
    }

    return navData.isActive ? styles.activeLink : "none";
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

  const handleLogout = async (e) => {
    e.preventDefault();
    await hideModal();
    fetchLogout();
  };

  // Save current url for use when window refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Save current url to localstorage
      localStorage.setItem("previousUrl", currentUrl);
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUrl]);

  return (
    <div style={{display: masterDisplay}} id="navbar" className={styles.header}>
      <WarningPopup
        selector={"generic-warning"}
        header={warningHeader}
        message={warningMessage}
        ok={"OK"}
        okClick={handleHideWarning}
      />
      {user && (
        <Fragment>
          <NotificationsModal />
          <ChatModal />
          <OutingModal />
          <ProfileViewerModal />
          <PhotoPopup />
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
              text={"Alerts"}
              className={`${styles.navButton} ${styles.notificationsHover}`}
            >
              {user && user.notifications.length > 0 ? (
                <div className={styles.notificationBadge}>
                  {user && user.notifications.length}
                </div>
              ) : null}
            </NavButton>
            <NavLink
              className={(navData) => makeActive(navData, "outing")}
              to="/outing"
            >
              <NavButton
                icon={activePage === "outing" ? outingIconBlue : outingIcon}
                text={"Outing"}
                className={`${styles.navButton} ${styles.createOutingHover}`}
                blue={activePage === "outing"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "profile")}
              to="/profile"
            >
              <NavButton
                icon={activePage === "profile" ? profileIconBlue : profileIcon}
                text={"Profile"}
                className={`${styles.navButton} ${styles.profileHover}`}
                blue={activePage === "profile"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "social")}
              to="/social"
            >
              <NavButton
                icon={activePage === "social" ? feedIconBlue : feedIcon}
                text={"Social"}
                className={`${styles.navButton} ${styles.socialHover}`}
                blue={activePage === "social"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "chat")}
              to="/chat"
            >
              <NavButton
                icon={activePage === "chat" ? chatIconBlue : chatIcon}
                text={"Chats"}
                className={`${styles.navButton} ${styles.chatsHover}`}
                blue={activePage === "chat"}
              >
                {unreadChatMessages > 0 ? (
                  <div className={styles.notificationBadge}>
                    {unreadChatMessages > 0 && unreadChatMessages}
                  </div>
                ) : null}
              </NavButton>
            </NavLink>
            <NavButton
              onClick={handleLogout}
              text={"Logout"}
              icon={logoutIcon}
              className={`${styles.navButton} ${styles.logoutHover}`}
            />
          </div>
        ) : (
          <img alt="logo" src={logo} className={styles.logo} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
