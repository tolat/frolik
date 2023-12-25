import styles from "./styles/ProfileHeader.module.scss";
import FriendCard from "./FriendCard";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import gear from "../../images/gear.png";

const ProfileHeader = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isSameUser = props.user._id === user._id;
  const modalSelector = useSelector((state) => state.selector);

  const handleClick = (e) => {
    if (isSameUser && modalSelector !== "profile-viewer-modal") {
      dispatch(modalActions.setSelector("edit-profile"));
      dispatch(modalActions.showModal());
    }
  };

  return (
    <div className={styles.container} id="profile-header">
      <div className={styles.innerContainer}>
        {props.user && (
          <FriendCard
            onClick={handleClick}
            showPhotoOnClick={!isSameUser && true}
            badge={false}
            user={props.user}
            noShadow={true}
            style={{ backgroundColor: "white", marginBottom: "0" }}
            sizeInRem={10}
            buttons={
              <div className={styles.sideBySide}>
                {isSameUser ? (
                  <div className={styles.settingButtonContainer}>
                    <img
                      onClick={handleClick}
                      className={styles.settingsButton}
                      src={gear}
                      alt="settings"
                    />
                  </div>
                ) : (
                  props.headerButtons
                )}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
