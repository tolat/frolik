import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/OutingModal.module.scss";
import SimpleButton from "../UI/SimpleButton";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { useEffect, useState } from "react";
import { popupActions } from "../../store/popup-slice";
import PhotoGrid from "../UI/PhotoGrid";
import photosIcon from "../../images/photos.png";
import activityIcon from "../../images/activity.png";
import membersIcon from "../../images/people.png";
import FriendCard from "../UI/FriendCard";
import ActivityCard from "../UI/ActivityCard";

const OutingModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "outing" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const showInfoPupup = props.showInfoPopup;
  const user = useSelector((state) => state.auth.user);
  const userData = useSelector((state) => state.data.users[user._id]);
  const dispatch = useDispatch();
  const outing = props.outing;
  const globals = useSelector((state) => state.auth.globals);
  const [categoryColor, setCategoryColor] = useState(null);
  const [completed, setCompleted] = useState(false);
  const activityIsCompletedType = user.outings?.find(
    (o) => o?.activity?._id === outing?.activity?._id
  );
  const photos = outing?.photos?.map(
    (key) => userData?.photos?.find((p) => p.key === key).photo
  );

  // Show the info popup if this is the first time opening
  useEffect(() => {
    if (showInfoPupup && modalDisplay === "flex") {
      dispatch(popupActions.showPopup("outing-created"));
    }
  }, [showInfoPupup, dispatch, modalDisplay]);

  // Set categoryColour
  useEffect(() => {
    if (outing && globals && globals.categoryColorMap) {
      setCategoryColor(globals.categoryColorMap[outing.activity.category]);
      setCompleted(outing.status === "Completed");
    }
  }, [outing, globals]);

  const newOutingMessage = (
    <div className={styles.outingPopup}>
      <div className={styles.outingCreatedName}>{outing.name}</div>
      A request to accept the Outing has been sent to the other users. You can
      view this outing any time on the Profile page under the following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
    </div>
  );

  const onPopupOk = () => {
    dispatch(popupActions.hidePopup());
  };

  return !outing || !userData ? null : (
    <ModalPortal>
      <WarningPopup
        selector={"outing-created"}
        header={"Your new outing is called:"}
        message={newOutingMessage}
        ok={"OK"}
        okClick={onPopupOk}
      />
      <div style={modalStyle} className={styles.container}>
        <div className={styles.header}>
          <div
            style={{ borderLeft: `10px solid ${categoryColor}` }}
            className={styles.headerInnerContainer}
          >
            <div className={styles.outingName}>{outing.name}</div>
            <div
              className={styles.outingStatus}
            >{`Status: ${outing.status}`}</div>
          </div>
        </div>
        <div className={styles.sideBySide}>
          <SimpleButton className={styles.chatButton}>Chat</SimpleButton>
          <SimpleButton className={styles.completedButton}>
            {completed ? "Completed!" : "Mark Completed"}
          </SimpleButton>
        </div>
        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={activityIcon}
            alt={"activity"}
          />{" "}
          Activity
        </h2>
        <ActivityCard
          key={Math.random()}
          activity={outing.activity}
          completed={activityIsCompletedType}
          hideSelect={true}
        />
        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={photosIcon}
            alt={"photos"}
          />{" "}
          Photos
        </h2>
        {outing.photos[0] ? (
          <PhotoGrid images={photos} gridTemplateColumns="1fr 1fr" />
        ) : (
          <div className={styles.noPhotosMessage}>
            <div className={styles.noPhotosMessageHeader}>None Yet!</div>
            <div className={styles.noPhotosMessageText}>
              Each outing member can add one photo when the Outing is completed!
            </div>
          </div>
        )}
        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={membersIcon}
            alt={"members"}
          />{" "}
          Members
        </h2>
        {outing.users.map((u) => (
          <FriendCard buttonSet={"add"} user={u} key={Math.random()} />
        ))}
        {outing.status !== "Completed" ? (
          <SimpleButton className={styles.leaveButton}>
            Leave Outing
          </SimpleButton>
        ) : null}
      </div>
    </ModalPortal>
  );
};

export default OutingModal;
