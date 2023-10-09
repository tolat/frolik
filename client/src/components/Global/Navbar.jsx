import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogout } from "../../store/auth-actions";
import { useNavigate } from "react-router-dom";
import NavButton from "../UI/NavButton";

import logoutIcon from "../../images/get-out.png";
import profileIcon from "../../images/profile.png";
import chatIcon from "../../images/chat.png"
import logo from "../../images/balloon1.png";

const Navbar = (props) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(fetchLogout());
    navigate("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.innerContainer}>
        <Link to="/go">
          <img className={styles.logo} src={logo} alt="logo" />
        </Link>

        {authState.isAuthenticated ? (
          <div className={styles.navItems}>
            <Link to="/profile">
              <NavButton text={"Profile"} className={styles.navButton} />
            </Link>
            <Link to="/profile">
              <NavButton text={"Chat"} className={styles.navButton} />
            </Link>

              <NavButton
                onClick={handleLogout}
                text={"Logout"}
                className={styles.navButton}
              />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
