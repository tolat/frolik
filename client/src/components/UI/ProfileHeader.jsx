import styles from "./styles/ProfileHeader.module.scss";
import FriendCard from "./FriendCard";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { Settings } from "lucide-react";
import { Fragment } from "react";
import { useT } from "../../i18n";

const ProfileHeader = (props) => {
  const { t } = useT();
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
          <Fragment>
            <FriendCard
              onClick={handleClick}
              showPhotoOnClick={!isSameUser && true}
              badge={false}
              user={props.user}
              noShadow={true}
              style={{ backgroundColor: "transparent", border: "none", marginBottom: "0" }}
              sizeInRem={10}
              buttons={
                <div className={styles.sideBySide}>
                  {isSameUser ? (
                    <div className={styles.settingButtonContainer}>
                      <button
                        type="button"
                        onClick={handleClick}
                        className={styles.settingsButton}
                        aria-label={t("ui.profileHeader.settings")}
                        data-tour="settings"
                      >
                        <Settings size={21} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    props.headerButtons
                  )}
                </div>
              }
            />
            <div className={styles.tagline}>{props.user.tagline}</div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
