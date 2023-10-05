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
import UserIcon from "../UI/UserIcon";

// TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
import { userPhotos, profilePics } from "../../utils/globals";
// TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND

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
  const user = { ...useSelector((state) => state.auth.user) };
  const [selectedSliderKey, setSelectedSliderKey] = useState("_photos");
  const editButtonStyle = {
    color: "rgb(111, 111, 111)",
    backgroundColor: "rgb(223, 223, 223)",
    margin: "2rem 0 2rem 0",
  };

  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
  user.profile_picture =
    profilePics[`${user.first_name && user.first_name.toLowerCase()}`];
  user.photos = userPhotos;
  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND

  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.nonMediaSection}>
          <div className={styles.profilePicContainer}>
            <div className={styles.iconContainer}>
              <div className={styles.flakeIcon}></div>
              <div className={styles.iconRating}>{user.flake}</div>
            </div>
            <UserIcon
              sizeInRem={14}
              user={user}
              profilePic={user.profile_picture}
              borderSizeInRem={"1.5"}
            />
            <div className={styles.iconContainer}>
              <div className={styles.outingIcon}></div>
              <div className={styles.iconRating}>{user.outings.length}</div>
            </div>
          </div>

          <div
            className={styles.userName}
          >{`${user.first_name} ${user.last_name}`}</div>
          <div className={styles.tagline}>{user.tagline}</div>
          <SimpleButton style={editButtonStyle}>Edit Profile</SimpleButton>
          <SliderNavbar
            selected={selectedSliderKey}
            setSelected={setSelectedSliderKey}
            icons={sliderIcons}
          />
        </div>

        {selectedSliderKey === "_photos" ? (
          <PhotoGrid images={user.photos} gridTemplateColumns="1fr 1fr 1fr" />
        ) : selectedSliderKey === "_outings" ? (
          <OutingList outings={user.outings} user={user} />
        ) : (
          <div>friends</div>
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
