import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import { fetchLogout } from "../../store/auth-actions";
import NavButton from "../UI/NavButton";
import logo from "../../images/balloon1.png";
import bell from "../../images/bell.png";
import { hideModal } from "../../store/modal-actions";
import NotificationsModal from "../Modals/NotificationsModal";
import { modalActions } from "../../store/modal-slice";
import OutingModal from "../Modals/OutingModal";
import ChatModal from "../Modals/ChatModal";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  const modalState = useSelector((state) => state.modal);
  const activeChat = useSelector((state) => state.modal.activeChat);
  const activeOuting = useSelector((state) => state.modal.activeOuting);
  const dispatch = useDispatch();
  const makeActive = (navData) =>
    navData.isActive ? styles.activeLink : "none";

  const handleLogout = async (e) => {
    e.preventDefault();
    await hideModal();
    fetchLogout();
  };

  const handleShowNotifications = async () => {
    if (modalState.selector) {
      await hideModal();
    }
    dispatch(modalActions.setSelector("notifications"));
    dispatch(modalActions.showModal());
  };

  return (
    <div className={styles.header}>
      {user && <NotificationsModal />}
      {user && <ChatModal chat={activeChat} />}
      {user && <OutingModal outing={activeOuting} />}

      <div className={styles.innerContainer}>
        <NavLink className={(navData) => makeActive(navData)} to="/go">
          <div className={styles.goButton}>
            <img className={styles.logo} src={logo} alt="logo" />
          </div>
        </NavLink>

        {authState.isAuthenticated ? (
          <div className={styles.navItems}>
            <button
              onClick={handleShowNotifications}
              className={styles.notificationsButton}
            >
              <img
                className={styles.bellIcon}
                src={bell}
                alt={"notificaitons-bell"}
              />
              {user && user.notifications.length > 0 ? (
                <div className={styles.notificationBadge}>
                  {user && user.notifications.length}
                </div>
              ) : null}
            </button>
            <NavLink className={(navData) => makeActive(navData)} to="/profile">
              <NavButton text={"Profile"} className={styles.navButton} />
            </NavLink>
            <NavLink className={(navData) => makeActive(navData)} to="/chat">
              <NavButton text={"Chat"} className={styles.navButton} />
            </NavLink>

            <NavButton
              onClick={handleLogout}
              text={"Logout"}
              className={styles.navButton}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
