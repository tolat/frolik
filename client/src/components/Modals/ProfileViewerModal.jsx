import styles from "./styles/ProfileViewerModal.module.scss";
import { useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import PhotoGrid from "../UI/PhotoGrid";
import SimpleButton from "../UI/SimpleButton";
import ProfileHeader from "../UI/ProfileHeader";
import ModalPortal from "./ModalPortal";
import { fetchPhotos } from "../../utils/data-fetch";

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
  const user = useSelector((state) => state.modal.activeModalUser);
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);
  const userStatus = user?.status?.status;

  // Get photos for this user
  useEffect(() => {
    if (user) {
      fetchPhotos(user);
    }
  }, [user]);

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

  const handleAddFriendButtonClick = (e) => {
    console.log("adding friend");
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.nonMediaSection}>
          <ProfileHeader user={user} />
          <SimpleButton
            onClick={handleAddFriendButtonClick}
            className={styles.addFriend}
          >
            + Add Friend
          </SimpleButton>
        </div>
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
          ) : (
            <h1>Loading..</h1>
          )}
        </Fragment>
      </div>
    </ModalPortal>
  );
};

export default ProfileViewerModal;
