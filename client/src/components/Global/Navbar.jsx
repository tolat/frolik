import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import NavButton from "../UI/NavButton";
import bell from "../../images/bell6.png";
import bellBlue from "../../images/bell6-blue.png";
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
import outingIcon from "../../images/air-balloon.png";
import outingIconBlue from "../../images/air-balloon-blue.png";
import logo from "../../images/frolik2.png";
import InstallPromptModal from "../Modals/InstallPromptModal";
import Tour from "../Tour/Tour";
import SendActivityPopup from "../Popups/SendActivityPopup";
import SharedActivityPopup from "../Popups/SharedActivityPopup";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  // Count from the chat list (refreshed whenever a chat is read), not the
  // account's own copy of the chats, which only updated on a full reload
  const unreadChatMessages =
    user && chats?.length
      ? getTotalUnreadMessages({ ...user, chats })
      : getTotalUnreadMessages(user);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  const warningMessage = useSelector((state) => state.popup.warningMessage);
  const warningHeader = useSelector((state) => state.popup.warningHeader);
  // Derive the active tab from the URL (was set via setState during render)
  const activePage = currentUrl.split("/")[1] || false;
  const [masterDisplay, setMasterDisplay] = useState("flex");

  // Hide navbar on login page
  useEffect(() => {
    if (
      currentUrl === "/profile" ||
      currentUrl === "/alerts" ||
      currentUrl === "/outing" ||
      currentUrl === "/social" ||
      currentUrl === "/chat"
    ) {
      setMasterDisplay("flex");
    } else {
      setMasterDisplay("none");
    }
  }, [currentUrl]);


  const makeActive = (navData) =>
    navData.isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

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


  // Notification taps (relayed by the service worker) navigate in-app
  useEffect(() => {
    const go = (e) => e.detail && navigate(e.detail);
    window.addEventListener("frolik:navigate", go);
    return () => window.removeEventListener("frolik:navigate", go);
  }, [navigate]);

  return (
    <div
      style={{ display: masterDisplay }}
      id="navbar"
      className={styles.header}
    >
      <WarningPopup
        selector={"generic-warning"}
        header={warningHeader}
        message={warningMessage}
        ok={"OK"}
        okClick={handleHideWarning}
      />
      <InstallPromptModal />
      {user && (
        <Fragment>
          <ChatModal />
          <OutingModal />
          <ProfileViewerModal />
          <PhotoPopup />
          <SendActivityPopup />
          <SharedActivityPopup />
          <Tour />
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
            <NavLink
              className={(navData) => makeActive(navData)}
              to="/alerts"
            >
              <NavButton
                icon={activePage === "alerts" ? bellBlue : bell}
                text={"Alerts"}
                className={`${styles.navButton} ${styles.notificationsHover}`}
                blue={activePage === "alerts"}
              >
                {user && user.notifications.length > 0 ? (
                  <div className={styles.notificationBadge}>
                    {user && user.notifications.length}
                  </div>
                ) : null}
              </NavButton>
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
          </div>
        ) : (
          <img alt="logo" src={logo} className={styles.logo} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
