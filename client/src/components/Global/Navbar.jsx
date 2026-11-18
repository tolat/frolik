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
import { syncKeyboardOpen } from "../../utils/pageScroll";
import { useT, T } from "../../i18n";

const Navbar = (props) => {
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  const globals = useSelector((state) => state.auth.globals);
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
  // Outing button ring: all the category colours, like a full avatar ring
  const ringColors = Object.values(globals?.categoryColorMap || {});
  const outingRing = ringColors.length
    ? `conic-gradient(from 200deg, ${[...ringColors, ringColors[0]].join(", ")})`
    : undefined;

  // Hide navbar on login page
  useEffect(() => {
    syncKeyboardOpen(); // a page change never leaves the nav hidden

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
      <T k="nav.tooManyOutings.message" />
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={t("nav.tooManyOutings.iconAlt")}
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
      className={`${styles.header} app-navbar`}
    >
      <WarningPopup
        selector={"generic-warning"}
        header={warningHeader}
        message={warningMessage}
        ok={t("nav.ok")}
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
            header={t("nav.tooManyOutings.header")}
            message={tooManyOutingsMessage}
            ok={t("nav.tooManyOutings.ok")}
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
                text={t("nav.tabs.alerts")}
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
                text={t("nav.tabs.profile")}
                className={`${styles.navButton} ${styles.profileHover}`}
                blue={activePage === "profile"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "outing")}
              to="/outing"
            >
              {/* The centre button: round, a little bigger and lifted, with
                  the avatars' multicolour ring (every category colour) */}
              <NavButton
                icon={activePage === "outing" ? outingIconBlue : outingIcon}
                text={t("nav.tabs.outing")}
                className={`${styles.navButton} ${styles.featuredNavButton} ${styles.createOutingHover}`}
                blue={activePage === "outing"}
                featured={true}
                ringBackground={outingRing}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "social")}
              to="/social"
            >
              <NavButton
                icon={activePage === "social" ? feedIconBlue : feedIcon}
                text={t("nav.tabs.social")}
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
                text={t("nav.tabs.chats")}
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
          <img alt="frolik" src={logo} className={styles.logo} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
