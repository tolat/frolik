import styles from "./styles/ProfileViewerModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import PhotoGrid from "../UI/PhotoGrid";
import SimpleButton from "../UI/SimpleButton";
import ProfileHeader from "../UI/ProfileHeader";
import ModalPortal from "./ModalPortal";
import {
  fetchPhotos,
  removeFriend,
  sendFriendRequest,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import modalStyles from "./styles/SlideInModal.module.scss";
import { useNavigate } from "react-router-dom";
import { goActions } from "../../store/go-slice";

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
  const isFriend = user.friends.find((f) => f._id === modalUser._id);
  const navigate = useNavigate();
  const friendRequested = user.friend_requests.find(
    (fr) => fr === modalUser._id
  );
  const dispatch = useDispatch();

  // Get photos for this user
  useEffect(() => {
    if (modalUser) {
      setTimeout(() => {
        fetchPhotos(modalUser);
      }, 300);
    }
  }, [modalUser]);

  const onAddFriend = () => {
    const onComplete = (response) => {
      dispatch(
        authActions.setUser({
          ...response.user,
          friends: user.friends,
        })
      );
    };
    sendFriendRequest(user, modalUser, onComplete);
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
    removeFriend(user, modalUser, onComplete);
  };

  const onCreateOuting = () => {
    dispatch(goActions.addUser(modalUser));
    navigate("/go");
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Viewing Profile</div>
        <ProfileHeader user={modalUser} />
        {user._id === modalUser._id ? null : !isFriend ? (
          <SimpleButton
            onClick={friendRequested ? null : onAddFriend}
            className={
              friendRequested ? styles.unclickableButton : styles.addFriend
            }
          >
            {friendRequested ? "Freind Request Sent" : "+ Add Friend"}
            {friendRequested ? (
              <div style={{ marginLeft: "1rem" }}>&#10003;</div>
            ) : null}
          </SimpleButton>
        ) : (
          <div className={styles.sideBySide}>
            <SimpleButton
              onClick={onCreateOuting}
              className={styles.createOutingButton}
            >
              Create Outing
            </SimpleButton>
            <SimpleButton
              onClick={onRemoveFriend}
              className={styles.removeFriendButton}
            >
              Remove Friend
            </SimpleButton>
          </div>
        )}

        <Fragment>
          {user._id === modalUser._id ? (
            <Fragment>
              <br />
              <br />
            </Fragment>
          ) : null}
          {userPhotos[0] && userPhotos.length === userData.photos.length ? (
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
          ) : (
            <h2>Loading Photos..</h2>
          )}
        </Fragment>
      </div>
    </ModalPortal>
  );
};

export default ProfileViewerModal;
