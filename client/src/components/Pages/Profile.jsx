import styles from "./styles/Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
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
import editIcon from "../../images/edit-light.png";
import StatIcon from "../UI/StatIcon";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import { hideModalFast } from "../../store/modal-actions";
import locationIcon from "../../images/location-dark.png";

// TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
import { userPhotos } from "../../utils/globals";
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
  const iconStyle = { width: "4rem", height: "4rem" };
  const dispatch = useDispatch();

  const handleEditButtonClick = (e) => {
    dispatch(modalActions.setSelector("edit-profile"));
    dispatch(modalActions.showModal());
  };

  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND
  user.photos = userPhotos.concat(userPhotos);
  // TEMPORARY - NEED TO FIGURE OUT HOW TO SERVE THESE FROM BACKEND

  return (
    <Fragment>
      <EditProfileModal />
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
              sizeInRem={16}
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
          <PhotoGrid images={user.photos} gridTemplateColumns="1fr 1fr 1fr" />
        ) : selectedSliderKey === "_outings" ? (
          <OutingList user={user} />
        ) : (
          user.friends.map((f) => <FriendCard key={Math.random()} user={f} />)
        )}
      </div>
    </Fragment>
  );
};

export default Profile;

export const profileLoader = async () => {
  hideModalFast();

  return null;
};
