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
import StatIcon from "../UI/StatIcon";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import locationIcon from "../../images/location-dark.png";
import { pageRouteLoader } from "../../utils/utils";
import balloonIcon from "../../images/balloon1.png";
import { useNavigate } from "react-router-dom";
import IconButton from "../UI/IconButton";
import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/air-balloon.png";
import OutingModal from "../Modals/OutingModal";
import SimpleSearch from "../UI/SimpleSearch";

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
  const navigate = useNavigate();
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);
  const userStatus = user?.status?.status;
  const friendCardButtonStyle = { width: "3rem", height: "3rem" };
  const [modalOuting, setModalOuting] = useState(false);

  const onBalloonIconClick = () => {
    console.log("click");
    navigate("/go");
  };

  let statusClassName = null;
  switch (userStatus) {
    case "Ready":
      statusClassName = styles.statusReady;
      break;
    case "Searching":
      statusClassName = styles.statusSearching;
      break;
    case "Busy":
      statusClassName = styles.statusBusy;
      break;
    case "Inactive":
      statusClassName = styles.statusInactive;
      break;
    default:
      statusClassName = null;
  }

  const handleEditButtonClick = (e) => {
    dispatch(modalActions.setSelector("edit-profile"));
    dispatch(modalActions.showModal());
  };

  const FriendCardButtons = (props) => {
    return (
      <div className={styles.friendCardButtons}>
        <IconButton
          className={styles.friendCardButton}
          iconStyle={friendCardButtonStyle}
          icon={chatIcon}
        />
        <IconButton
          className={styles.friendCardButton}
          iconStyle={friendCardButtonStyle}
          icon={getOutIcon}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <EditProfileModal />
      <OutingModal selector={"view-outing"} outing={modalOuting} />
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
            pieShadow={true}
          />
          <StatIcon
            alt="outings"
            icon={outingsIcon}
            iconStyle={iconStyle}
            rating={user.outings?.length}
          />
        </div>
        <div
          className={styles.userName}
        >{`${user.first_name} ${user.last_name}`}</div>
        <div className={styles.tagline}>{user.tagline}</div>
        <div className={styles.sideBySide}>
          <div className={`${styles.statusContainer} ${statusClassName}`}>
            Status: {user?.status?.status}
          </div>
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

      {!userPhotos[0] && !user.friends[0] && !user.outings[0] ? (
        <div className={styles.noContentBlurb}>
          <h3>You have no media yet!</h3>
          <div>To start adding photos, outings and friends, create </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            and complete an outing on the{" "}
            <img
              onClick={onBalloonIconClick}
              className={styles.outingBalloon}
              src={balloonIcon}
              alt="outing page icon"
            />{" "}
            page!
          </div>
        </div>
      ) : selectedSliderKey === "_photos" ? (
        <Fragment>
          <PhotoGrid images={userPhotos} gridTemplateColumns="1fr 1fr" />
          <div className={styles.noImagesBlurb}>
            <div>To add photos, complete more </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              outings on the{" "}
              <img
                onClick={onBalloonIconClick}
                className={styles.outingBalloon}
                src={balloonIcon}
                alt="outing page icon"
              />{" "}
              page!
            </div>
          </div>
        </Fragment>
      ) : selectedSliderKey === "_outings" ? (
        <Fragment>
          <SimpleSearch
            style={{ marginTop: "1rem" }}
            placeholder={"Search Outings"}
          />
          <OutingList setModalOuting={setModalOuting} user={user} />
        </Fragment>
      ) : (
        <Fragment>
          <SimpleSearch
            style={{ marginTop: "1rem" }}
            placeholder={"Search Friends"}
          />
          {user.friends.map((f) => (
            <FriendCard
              buttons={<FriendCardButtons user={f} />}
              key={Math.random()}
              user={f}
            />
          ))}
        </Fragment>
      )}
    </div>
  );
};

export default Profile;

export const profileLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
