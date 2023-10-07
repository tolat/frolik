import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./styles/Navbar.module.scss";
import logo from "../../images/get-out-logo.png";
import { useDispatch } from "react-redux";
import { fetchLogout } from "../../store/auth-actions";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(fetchLogout());
    navigate('/login')
  };

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
            <button onClick={handleLogout} type="button">
              Logout
            </button>
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
