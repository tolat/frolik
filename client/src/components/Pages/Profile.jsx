import styles from "./styles/Profile.module.scss";
import { useSelector } from "react-redux";
import { checkAuth } from "../../store/auth-actions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth-actions";
import { authActions } from "../../store/auth-slice";

const Profile = (props) => {
  const userID = useSelector((state) => state.auth.userID);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If we are not authenticated, navigate to /login
  useEffect(() => {
    if (!userID) {
      navigate("/login");
    }
  }, [navigate, userID]);

  const handleLogout = async (e) => {
    e.preventDefault();
    // Dispatch login action from redux context auth-actions
    if (process.env.NODE_ENV === "development") {
      await dispatch(authActions.logout());
    } else {
      await dispatch(logout());
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Profile</h1>
        <button onClick={handleLogout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

export const profileLoader = async () => {
  if (process.env.NODE_ENV !== "development") {
    await checkAuth()();
  }
  return null;
};
