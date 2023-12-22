import styles from "./styles/ProfileViewerModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import PhotoGrid from "../UI/PhotoGrid";
import photos from "../../images/photogrid.png";
import getOutIcon from "../../images/air-balloon.png";
import deleteFriend from "../../images/remove-friend.png";
import addFriend from "../../images/add-friend.png";
import sentMail from "../../images/sent-mail.png";
import ProfileHeader from "../UI/ProfileHeader";
import ModalPortal from "./ModalPortal";
import {
  fetchPhotos,
  removeFriend,
  sendFriendRequest,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { goActions } from "../../store/go-slice";
import ModalHeaderPortal from "./ModalHeaderPortal";
import SliderNavbar from "../UI/SliderNavbar";
import IconButton from "../UI/IconButton";

const sliderIcons = [
  {
    key: "_photos",
    name: "Photos",
    url: photos,
  },
];

const getPhotosFromState = (userData) => {
  return !userData
    ? []
    : userData.photos.filter((p) => p && p.photo).map((p) => p.photo);
};

const ProfileViewerModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "profile-viewer-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const modalUser = useSelector((state) => state.modal.activeModalUser);
  const user = useSelector((state) => state.auth.user);
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[modalUser._id];
  const userPhotos = getPhotosFromState(userData);

  // Get photos for this user
  useEffect(() => {
    if (modalUser) {
      fetchPhotos(modalUser);
    }
  }, [modalUser]);

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <ModalHeaderPortal selector={"profile-viewer-modal"}>
          Viewing Profile
        </ModalHeaderPortal>
        <ProfileHeader
          user={modalUser}
          headerButtons={<ControlButtons user={user} modalUser={modalUser} />}
        />
        <SliderNavbar
          id="slider-navbar"
          selected={"_photos"}
          setSelected={() => {}}
          icons={sliderIcons}
          style={{ paddingTop: "0" }}
        />
        <Fragment>
          {user._id === modalUser._id ? (
            <Fragment>
              <br />
              <br />
            </Fragment>
          ) : null}
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
          ) : user.outings.length > 0 ? (
            <h2>No Photos Yet!</h2>
          ) : (
            <h2>Loading Photos..</h2>
          )}
        </Fragment>
      </div>
    </ModalPortal>
  );
};

const ControlButtons = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFriend = props.user.friends.find(
    (f) => f._id === props.modalUser._id
  );
  const friendRequested = props.user.friend_requests.find(
    (fr) => fr === props.modalUser._id
  );

  const onAddFriend = () => {
    const onComplete = (response) => {
      dispatch(
        authActions.setUser({
          ...response.user,
          friends: props.user.friends,
        })
      );
    };
    sendFriendRequest(props.user, props.modalUser, onComplete);
  };

  const onRemoveFriend = () => {
    const onComplete = (response) => {
      dispatch(
        authActions.setUser({
          ...response.user,
          friends: response.populatedFriends,
        })
      );
    };
    removeFriend(props.user, props.modalUser, onComplete);
  };

  const onCreateOuting = () => {
    dispatch(goActions.addUser(props.modalUser));
    navigate("/outing");
  };

  const buttonIconStyle = { width: "3.5rem" };

  return (
    <div className={styles.friendCardButtons}>
      {isFriend ? (
        <div className={styles.buttonContainer}>
          <IconButton
            onClick={() => onCreateOuting()}
            className={styles.buttonStyle}
            iconStyle={buttonIconStyle}
            icon={getOutIcon}
            subText={'+ Outing'}
          />
          <IconButton
            onClick={() => onRemoveFriend(props.user)}
            className={styles.buttonStyle}
            iconStyle={buttonIconStyle}
            icon={deleteFriend}
            subText={'Unfriend'}
          />{" "}
        </div>
      ) : friendRequested ? (
        <IconButton
          onClick={() => {}}
          className={styles.buttonStyle}
          iconStyle={buttonIconStyle}
          icon={sentMail}
          subText={'Requested'}
        />
      ) : (
        <IconButton
          onClick={() => onAddFriend()}
          className={styles.buttonStyle}
          iconStyle={buttonIconStyle}
          icon={addFriend}
          subText={'+ Friend'}
        />
      )}
    </div>
  );
};

export default ProfileViewerModal;
