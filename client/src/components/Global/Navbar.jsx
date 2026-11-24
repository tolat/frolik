import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import NavButton from "../UI/NavButton";
import OutingModal from "../Modals/OutingModal";
import ChatModal from "../Modals/ChatModal";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { Fragment, useEffect, useState } from "react";
import ProfileViewerModal from "../Modals/ProfileViewerModal";
import { getTotalUnreadMessages, unreadNotificationCount } from "../../utils/utils";
import PhotoPopup from "../Popups/PhotoPopup";
import balloonLogo from "../../images/brand/balloon-flat.svg";
import { Bell, CircleUserRound, Images, MessageCircle } from "lucide-react";
import logo from "../../images/frolik2.png";
import InstallPromptModal from "../Modals/InstallPromptModal";
import UpdateAppDrawer from "../Popups/UpdateAppDrawer";
import Tour from "../Tour/Tour";
import SendActivityPopup from "../Popups/SendActivityPopup";
import SharedActivityPopup from "../Popups/SharedActivityPopup";
import PushDrawer from "../Popups/PushDrawer";
import { syncKeyboardOpen } from "../../utils/pageScroll";
import { resendVerificationEmail } from "../../utils/data-fetch";
import { useT, T } from "../../i18n";

const Navbar = (props) => {
  const { t } = useT();
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
  const warningAction = useSelector((state) => state.popup.warningAction);
  const [resendState, setResendState] = useState("idle");

  // "Email Verification Required" at login: send a new verification link,
  // then turn the drawer into a "New link sent" confirmation
  const onResendVerification = () => {
    if (resendState === "sending" || !warningAction?.email) return;
    const email = warningAction.email;
    setResendState("sending");
    resendVerificationEmail(email, (response) => {
      setResendState("idle");
      if (response?.ok === false || response instanceof Error) return; // its own error popup shows
      dispatch(popupActions.setWarningAction(null));
      dispatch(popupActions.setWarningHeader(t("nav.resendVerification.sentHeader")));
      dispatch(
        popupActions.setWarningMessage(t("nav.resendVerification.sentMessage", { email }))
      );
    });
  };
  // Derive the active tab from the URL (was set via setState during render)
  const activePage = currentUrl.split("/")[1] || false;
  const [masterDisplay, setMasterDisplay] = useState("flex");

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
      {warningAction?.type === "resend-verification" ? (
        // Login before verifying: offer a fresh link right here
        <WarningPopup
          selector={"generic-warning"}
          header={warningHeader}
          message={warningMessage}
          ok={
            resendState === "sending"
              ? t("nav.resendVerification.sending")
              : t("nav.resendVerification.button")
          }
          okUnclickable={resendState === "sending"}
          okClick={onResendVerification}
          cancel={t("nav.ok")}
          cancelClick={handleHideWarning}
        />
      ) : (
        <WarningPopup
          selector={"generic-warning"}
          header={warningHeader}
          message={warningMessage}
          ok={t("nav.ok")}
          okClick={handleHideWarning}
        />
      )}
      <InstallPromptModal />
      <UpdateAppDrawer />
      {user && (
        <Fragment>
          <ChatModal />
          <OutingModal />
          <ProfileViewerModal />
          <PhotoPopup />
          <SendActivityPopup />
          <SharedActivityPopup />
          <PushDrawer />
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
                glyph={Bell}
                text={t("nav.tabs.alerts")}
                className={`${styles.navButton} ${styles.notificationsHover}`}
                blue={activePage === "alerts"}
              >
                {unreadNotificationCount(user) > 0 ? (
                  <div className={styles.notificationBadge}>
                    {unreadNotificationCount(user)}
                  </div>
                ) : null}
              </NavButton>
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "profile")}
              to="/profile"
            >
              <NavButton
                glyph={CircleUserRound}
                text={t("nav.tabs.profile")}
                className={`${styles.navButton} ${styles.profileHover}`}
                blue={activePage === "profile"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "outing")}
              to="/outing"
            >
              {/* The frolik balloon logo, in full colour (never tinted) */}
              <NavButton
                icon={balloonLogo}
                keepColor={true}
                text={t("nav.tabs.outing")}
                className={`${styles.navButton} ${styles.createOutingHover}`}
                blue={activePage === "outing"}
              />
            </NavLink>
            <NavLink
              className={(navData) => makeActive(navData, "social")}
              to="/social"
            >
              <NavButton
                glyph={Images}
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
                glyph={MessageCircle}
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
