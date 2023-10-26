import styles from "./styles/Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import SliderNavbar from "../UI/SliderNavbar";
import PhotoGrid from "../UI/PhotoGrid";
import photos from "../../images/photogrid.png";
import friends from "../../images/friends.png";
import outings from "../../images/outing2.png";
import SimpleButton from "../UI/SimpleButton";
import OutingList from "../UI/OutingList";
import UserIcon from "../UI/UserIcon";
import buttonStyles from "../UI/styles/SimpleButton.module.scss";
import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import StatIcon from "../UI/StatIcon";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import locationIcon from "../../images/location-dark.png";
import { pageLoader } from "../../utils/utils";

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

const getPhotosFromState = (userData) => {
  return !userData
    ? []
    : userData.photos.filter((p) => p && p.photo).map((p) => p.photo);
};

const Profile = (props) => {
  const user = { ...useSelector((state) => state.auth.user) };
  const [selectedSliderKey, setSelectedSliderKey] = useState("_photos");
  const iconStyle = { width: "4rem", height: "4rem" };
  const dispatch = useDispatch();
  const dataState = useSelector((state) => state.data)
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);

  const handleEditButtonClick = (e) => {
    dispatch(modalActions.setSelector("edit-profile"));
    dispatch(modalActions.showModal());
  };


  return !user ? null : (
    <div className={styles.container}>
      <EditProfileModal />
      <div className={styles.nonMediaSection}>
        <div className={styles.profilePicContainer}>
          <StatIcon
            alt="flake"
            icon={flakeIcon}
            iconStyle={iconStyle}
            rating={user.flake}
          />
          <UserIcon
            backerClassName={styles.iconBacker}
            sizeInRem={20}
            user={user}
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
        <div className={styles.sideBySide}>
          <div className={styles.statusContainer}>Status: {user.status}</div>
          <div className={styles.locationContainer}>
            <img
              style={{ marginRight: "10px" }}
              className={styles.smallIcon}
              src={locationIcon}
              alt="location-icon"
            />
            {user.location}
          </div>
        </div>

        <SimpleButton
          onClick={handleEditButtonClick}
          className={buttonStyles.greyButton}
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
  const redirect = await pageLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
