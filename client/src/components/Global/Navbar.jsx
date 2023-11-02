import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import { fetchLogout } from "../../store/auth-actions";
import NavButton from "../UI/NavButton";
import logo from "../../images/balloon1.png";
import { hideModal } from "../../store/modal-actions";

const Navbar = (props) => {
  const authState = useSelector((state) => state.auth);
  const makeActive = (navData) =>
    navData.isActive ? styles.activeLink : "none";

  const handleLogout = async (e) => {
    e.preventDefault();
    await hideModal();
    fetchLogout();
  };

  return (
    <div className={styles.header}>
      <div className={styles.innerContainer}>
        <NavLink className={(navData) => makeActive(navData)} to="/go">
          <div className={styles.goButton}>
            <img className={styles.logo} src={logo} alt="logo" />
          </div>
        </NavLink>

        {authState.isAuthenticated ? (
          <div className={styles.navItems}>
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
