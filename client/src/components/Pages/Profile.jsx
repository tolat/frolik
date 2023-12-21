import styles from "./styles/Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
import SliderNavbar from "../UI/SliderNavbar";
import PhotoGrid from "../UI/PhotoGrid";
import photos from "../../images/photogrid.png";
import friends from "../../images/friends.png";
import outings from "../../images/outing2.png";
import OutingList from "../UI/OutingList";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import { pageRouteLoader, toSorted } from "../../utils/utils";
import balloonIcon from "../../images/air-balloon.png";
import { useNavigate } from "react-router-dom";
import IconButton from "../UI/IconButton";
import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/air-balloon.png";
import SimpleSearch from "../UI/SimpleSearch";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import ProfileHeader from "../UI/ProfileHeader";
import { goActions } from "../../store/go-slice";
import { createChat, fetchChats } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import editIcon from "../../images/edit-light.png";

const sliderIcons = [
  {
    key: "_photos",
    name: "Photos",
    url: photos,
  },
  {
    key: "_outings",
    name: "Outings",
    url: outings,
  },
  {
    key: "_friends",
    name: "Friends",
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
  const [selectedSliderKey, setSelectedSliderKey] = useState("_outings");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);
  const friendCardButtonStyle = { width: "3rem", height: "3rem" };
  const modalIsShowing = useSelector(
    (state) => state.modal.selector !== "none"
  );

  const onBalloonIconClick = () => {
    navigate("/outing");
  };

  const handleEditButtonClick = (e) => {
    dispatch(modalActions.setSelector("edit-profile"));
    dispatch(modalActions.showModal());
  };

  const onCreateOuting = (withUser) => {
    dispatch(goActions.reset([user]));
    dispatch(goActions.addUser(withUser));
    navigate("/outing");
  };

  const onCreateChat = (withUser) => {
    const onComplete = async (response) => {
      fetchChats(user);
      dispatch(modalActions.setActiveChat(response.chat));
      if (modalIsShowing) await hideModal(true);
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
    };

    createChat(user, [withUser], onComplete);
  };

  const FriendCardButtons = (props) => {
    return (
      <div className={styles.friendCardButtons}>
        <IconButton
          onClick={() => onCreateChat(props.user)}
          className={styles.friendCardButton}
          iconStyle={friendCardButtonStyle}
          icon={chatIcon}
        />
        <IconButton
          onClick={() => onCreateOuting(props.user)}
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
      <div className={styles.nonMediaSection} id="non-media-section">
        <ProfileHeader
          badge={
            <img
              onClick={handleEditButtonClick}
              src={editIcon}
              className={styles.editIcon}
              alt="edit"
            />
          }
          onEditClick={handleEditButtonClick}
          user={user}
        />
        <SliderNavbar
          id="slider-navbar"
          selected={selectedSliderKey}
          setSelected={setSelectedSliderKey}
          icons={sliderIcons}
          style={{ paddingTop: "0" }}
        />
      </div>
      <div
        className={styles.nonMediaSection}
        style={{ opacity: 0, position: "relative" }}
        id="non-media-section"
      >
        <ProfileHeader
          badge={
            <img
              onClick={handleEditButtonClick}
              src={editIcon}
              className={styles.editIcon}
              alt="edit"
            />
          }
          onEditClick={handleEditButtonClick}
          user={user}
        />
        <SliderNavbar
          id="slider-navbar"
          selected={selectedSliderKey}
          setSelected={setSelectedSliderKey}
          icons={sliderIcons}
          style={{ paddingTop: "0" }}
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
          {userPhotos[0] ? (
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
          ) : user.outings.length > 0 ? null : (
            <h2>Loading Photos..</h2>
          )}

          {!userPhotos[0] ? (
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
          ) : null}
        </Fragment>
      ) : selectedSliderKey === "_outings" ? (
        <Fragment>
          <OutingList />
        </Fragment>
      ) : (
        <Fragment>
          <SimpleSearch
            style={{ marginTop: "1rem" }}
            placeholder={"Search Friends"}
          />
          {user.friends[0] ? (
            toSorted(user.friends, (a, b) => a.first_name - b.first_name).map(
              (f) => (
                <FriendCard
                  buttons={<FriendCardButtons user={f} />}
                  key={Math.random()}
                  user={f}
                />
              )
            )
          ) : (
            <div className={styles.noImagesBlurb}>
              <div style={{ display: "flex", alignItems: "center" }}>
                To add friends, go to the
                <img
                  onClick={onBalloonIconClick}
                  className={styles.outingBalloon}
                  src={balloonIcon}
                  alt="outing page icon"
                />{" "}
                page!
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Profile;

export const profileLoader = async () => {
  const redirect = await pageRouteLoader("/profile");
  if (redirect) {
    return redirect;
  }

  return null;
};
