import styles from "./styles/Profile.module.scss";
import { useSelector } from "react-redux";
import { fetchAuth } from "../../store/auth-actions";
import MainContainer from "../UI/MainContainer";
import { redirect } from "react-router-dom";
import store from "../../store";
import { useState } from "react";

import SliderNavbar from "../UI/SliderNavbar";
import PhotoGrid from "../UI/PhotoGrid";

import photos from "../../images/photogrid.png";
import friends from "../../images/friends.png";
import outings from "../../images/outing2.png";


import SimpleButton from "../UI/SimpleButton";
import OutingList from "../UI/OutingList";

import { JaneOutings } from "../../utils/client-dev-db";
import UserIcon from "../UI/UserIcon";

const sliderIcons = [
  {
    key: "_photos",
    url: photos,
  },
  {
    key: "_outings",
    url: outings,
  },
  {
    key: "_friends",
    url: friends,
  },
];

const Profile = (props) => {
  const authState = useSelector((state) => state.auth);
  
  const userPhotos = authState.user.photos.map((p) => {
    return { url: p, key: Math.random() };
  });

  // MUST CHANGE TO USE AUTHSTATE.USER FOR USE WITH SERVER
  const userOutings = JaneOutings;

  const [selectedSliderKey, setSelectedSliderKey] = useState("_photos");

  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.nonMediaSection}>
          <div className={styles.profilePicContainer}>
            <div className={styles.iconContainer}>
              <div className={styles.flakeIcon}></div>
              <div className={styles.iconRating}>1.2</div>
            </div>
            <UserIcon sizeInRem={14} user={authState.user}/>
            <div className={styles.iconContainer}>
              <div className={styles.outingIcon}></div>
              <div className={styles.iconRating}>14</div>
            </div>
          </div>

          <div
            className={styles.userName}
          >{`${authState.user.first_name} ${authState.user.last_name}`}</div>
          <div className={styles.tagline}>{authState.user.tagline}</div>
          <SimpleButton
            style={{
              color: "rgb(111, 111, 111)",
              backgroundColor: "rgb(223, 223, 223)",
              margin: "2rem 0 2rem 0"
            }}
          >
            Edit Profile
          </SimpleButton>
          <SliderNavbar
            selected={selectedSliderKey}
            setSelected={setSelectedSliderKey}
            icons={sliderIcons}
          />
        </div>

        {selectedSliderKey === "_photos" ? (
          <PhotoGrid images={userPhotos} gridTemplateColumns="1fr 1fr 1fr" />
        ) : (
          <OutingList outings={userOutings} />
        )}
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
