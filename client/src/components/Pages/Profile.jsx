import styles from "./styles/Profile.module.scss";
import { useSelector } from "react-redux";
import { fetchAuth } from "../../store/auth-actions";
import MainContainer from "../UI/MainContainer";
import { redirect } from "react-router-dom";
import store from "../../store";

const Profile = (props) => {
  const authState = useSelector((state) => state.auth);

  return (
    <MainContainer>
      <div>
        <h1>Profile</h1>
      </div>
    </MainContainer>
  );
};

export default Profile;

export const profileLoader = async () => {
  await fetchAuth()();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  }

  return null;
};
