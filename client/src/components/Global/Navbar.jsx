import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import logo from "../../images/get-out-logo.png"

const Navbar = (props) => {
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" />
      </div>
      <div>
        {authState.isAuthenticated ? (
          <div className={styles.navItems}>
            <Link to="/go">Go Page</Link>
            <Link to="/profile">Profile Page</Link>
          </div>
        ) : (
          <div className={styles.navItems}>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
