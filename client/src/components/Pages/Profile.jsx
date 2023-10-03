import styles from "./styles/Profile.module.scss";
import { useSelector } from "react-redux";
import { fetchAuth } from "../../store/auth-actions";
import MainContainer from "../UI/MainContainer";
import { redirect } from "react-router-dom";
import store from "../../store";

// REMOVE FOR BUILD, DUMMY IMAGES
import img1 from "../../images/sampleUserImgs/acroyoga.png";
import img2 from "../../images/sampleUserImgs/beerpong.png";
import img3 from "../../images/sampleUserImgs/drawing.png";
import img4 from "../../images/sampleUserImgs/football.png";
import img5 from "../../images/sampleUserImgs/kayaking.png";
import img6 from "../../images/sampleUserImgs/lawngame.png";
import img7 from "../../images/sampleUserImgs/icecream.png";
import img8 from "../../images/sampleUserImgs/tenniscourt.png";
import img9 from "../../images/sampleUserImgs/beach.png";

const Profile = (props) => {
  const authState = useSelector((state) => state.auth);

  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.userIcon}></div>
        <h2>Tagline</h2>
        <h1 className={styles.tagline}>{authState.user.tagline}</h1>
        <h2>Photos</h2>
        <div className={styles.photoGrid}>
          <img className={styles.userImg} alt="userImage" src={img1} />
          <img className={styles.userImg} alt="userImage" src={img2} />
          <img className={styles.userImg} alt="userImage" src={img3} />
          <img className={styles.userImg} alt="userImage" src={img4} />
          <img className={styles.userImg} alt="userImage" src={img5} />
          <img className={styles.userImg} alt="userImage" src={img6} />
          <img className={styles.userImg} alt="userImage" src={img7} />
          <img className={styles.userImg} alt="userImage" src={img8} />
          <img className={styles.userImg} alt="userImage" src={img9} />
        </div>
        <h2>Friends</h2>
        <div className={styles.friendsContainer}>
          <div className={styles.friendIcon}></div>
          <div className={styles.friendIcon}></div>
          <div className={styles.friendIcon}></div>
        </div>
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
