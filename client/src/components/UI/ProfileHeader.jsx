import styles from "./styles/ProfileHeader.module.scss";
import locationIcon from "../../images/location-dark.png";
import FriendCard from "./FriendCard";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-slice";

const ProfileHeader = (props) => {
  const userStatus = props.user?.status?.status;
  const dispatch = useDispatch()

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

  const handleClick = (e) =>{
      dispatch(modalActions.setSelector('edit-profile'))
      dispatch(modalActions.showModal())
  }

  return (
    <div className={styles.container} id="profile-header">
      <div className={styles.innerContainer}>
        {props.user && (
          <FriendCard
            onClick={handleClick}
            badge={false}
            user={props.user}
            noShadow={true}
            style={{ backgroundColor: "white", marginBottom: "0" }}
            sizeInRem={10}
            buttons={
              <Fragment>
                <div className={styles.sideBySide}>
                  <div
                    onClick={props.onEditClick}
                    className={`${styles.statusContainer} ${statusClassName}`}
                  >
                    Status: {userStatus}
                  </div>
                  <div
                    onClick={props.onEditClick}
                    className={styles.locationContainer}
                  >
                    <img
                      style={{ marginRight: "10px" }}
                      className={styles.smallIcon}
                      src={locationIcon}
                      alt="location-icon"
                    />
                    {props.user.location}
                  </div>
                </div>
              </Fragment>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
