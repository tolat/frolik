import styles from "./styles/Profile.module.scss";
import { useSelector } from "react-redux";
import { checkAuth } from "../../store/auth-actions";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { logout } from "../../store/auth-actions";

const Profile = (props) => {
  const userID = useSelector((state) => state.auth.userID);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // If we are not authenticated, navigate to /login
  useEffect(()=>{
    if(!userID){
      navigate("/login")
    }
  },[navigate, userID])

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
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

// $$ Write profile loader to either get user data on page load or
// return to login page if not authenticated

export const profileLoader = async()=>{
  await checkAuth()()
  return null
}