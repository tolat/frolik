import styles from "./styles/Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth } from "../../store/auth-actions";
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

import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";

// TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
import { userPhotos } from "../../utils/globals";
// TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND

import StatIcon from "../UI/StatIcon";
import FriendCard from "../UI/FriendCard";
import { modalActions } from "../../store/modal-slice";

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
  const iconStyle = { width: "4rem", height: "4rem" };
  const dispatch = useDispatch()

  const handleEditButtonClick = async (e) => {
     await dispatch(modalActions.setSelector('edit-profile'))
     await dispatch(modalActions.showModal())
  };

  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
  user.photos = userPhotos.concat(userPhotos);
  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND

  return (
    <div className={styles.container}>
      <div className={styles.nonMediaSection}>
        <div className={styles.profilePicContainer}>
          <StatIcon
            alt="flake"
            icon={flakeIcon}
            iconStyle={iconStyle}
            rating={user.flake}
          />
          <UserIcon
            sizeInRem={14}
            user={user}
            profilePic={user.profile_picture}
            borderSizeInRem={"1.5"}
          />
          <StatIcon
            alt="outings"
            icon={outingsIcon}
            iconStyle={iconStyle}
            rating={user.outings.length}
          />
        </div>

        <div
          className={styles.userName}
        >{`${user.first_name} ${user.last_name}`}</div>
        <div className={styles.tagline}>{user.tagline}</div>
        <SimpleButton onClick={handleEditButtonClick} style={editButtonStyle}>
          Edit Profile
        </SimpleButton>
        <SliderNavbar
          selected={selectedSliderKey}
          setSelected={setSelectedSliderKey}
          icons={sliderIcons}
        />
      </div>

      {selectedSliderKey === "_photos" ? (
        <PhotoGrid images={user.photos} gridTemplateColumns="1fr 1fr 1fr" />
      ) : selectedSliderKey === "_outings" ? (
        <OutingList user={user} />
      ) : (
        user.friends.map((f) => <FriendCard key={Math.random()} user={f} />)
      )}
    </div>
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
