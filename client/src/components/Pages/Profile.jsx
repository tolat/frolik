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
import buttonStyles from "../UI/styles/SimpleButton.module.scss";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import { pageRouteLoader } from "../../utils/utils";
import balloonIcon from "../../images/balloon1.png";
import { useNavigate } from "react-router-dom";
import IconButton from "../UI/IconButton";
import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/air-balloon.png";
import SimpleSearch from "../UI/SimpleSearch";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import ProfileHeader from "../UI/ProfileHeader";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);
  const userStatus = user?.status?.status;
  const friendCardButtonStyle = { width: "3rem", height: "3rem" };

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

  const tooManyOutingsMessage = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <b>You can only have up to 5 pending outings at a time.</b> <br />
      Either complete or delete some outings before trying to create another
      one. You can view your outings any time in the 'Profile' page by clicking
      the following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
    </div>
  );

  const handleHideWarning = () => {
    dispatch(popupActions.hidePopup());
  };

  return (
    <div className={styles.container}>
      <EditProfileModal />
      <WarningPopup
        selector={"too-many-outings"}
        header={"You have too many Pending Outings!"}
        message={tooManyOutingsMessage}
        ok={"OK"}
        okClick={handleHideWarning}
      />
      <div className={styles.nonMediaSection}>
        <ProfileHeader user={user} />
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
          <PhotoGrid
            images={userPhotos}
            gridTemplateColumns={
              userPhotos.length === 1
                ? `1fr`
                : userPhotos.length === 2
                ? "1fr 1fr"
                : "1fr 1fr 1fr"
            }
          />
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
          <OutingList />
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
