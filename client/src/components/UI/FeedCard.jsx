import { useDispatch, useSelector } from "react-redux";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect, useState } from "react";
import { fetchOutingPhoto, fetchProfilePic } from "../../utils/data-fetch";
import { dataActions } from "../../store/data-slice";
import SimpleButton from "./SimpleButton";
import heart from "../../images/heart.png";
import heartFull from "../../images/heart2.png";
import { popupActions } from "../../store/popup-slice";
import EmptyPopup from "../Popups/EmptyPopup";
import ActivityCard from "./ActivityCard";
import FriendCard from "./FriendCard";

const FeedCard = (props) => {
  const globals = useSelector((state) => state.auth.globals);
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = globals.categoryColorMap;
  const outing = props.outing;
  const activityColor = categoryColorMap[outing?.activity?.category];
  const cachedPhotos = useSelector((state) => state.data.cachedPhotos);
  const outingPhotos = outing?.photos.map((p) => cachedPhotos[p.key]);
  const photoGridNumber = outingPhotos?.length > 6 ? 6 : outingPhotos?.length;
  const dispatch = useDispatch();
  const outingUsers = outing?.users;
  const [liked, setLiked] = useState(false);
  const activityPopupSelector = `${outing?._id}-activity-popup`;
  const usersPopupSelector = `${outing?._id}-users-popup`;
  let memberNames = outingUsers
    .map((u) => `${u.first_name}, `)
    .reduce((acc, curr) => (acc = acc.concat(curr)), "");

  memberNames = memberNames.slice(0, memberNames.length - 2);

  // Get Outing photos from server
  useEffect(() => {
    const onComplete = (key, photoString) => {
      dispatch(dataActions.addCachedPhoto({ key, photoString }));
    };

    // Fetch each photo and add it to cached Photos
    for (let photo of outing?.photos) {
      fetchOutingPhoto(outing, photo.key, (photoString) =>
        onComplete(photo.key, photoString)
      );
    }
  }, [user, outing, dispatch]);

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  // Get missing profile pictures from server
  useEffect(() => {
    for (let u of outingUsers) {
      fetchProfilePic(u._id);
    }
  }, [outingUsers]);

  const onShowActivityPopup = () => {
    dispatch(popupActions.showPopup(activityPopupSelector));
  };

  const onLikeClick = () => {
    setLiked((prevState) => !prevState);
  };

  const onClusterClick = () => {
    dispatch(popupActions.showPopup(usersPopupSelector));
  };

  return (
    outing && (
      <div className={styles.container}>
        <EmptyPopup selector={activityPopupSelector}>
          <ActivityCard
            showInstructions={true}
            activity={outing.activity}
            hideSelect={true}
          />
        </EmptyPopup>
        <EmptyPopup selector={usersPopupSelector}>
          <div className={styles.friendsPopupContainer}>
            <h2 className={styles.friendsPopupHeader}>Outing Members</h2>
            {outing.users.map((u) => (
              <FriendCard key={Math.random()} user={u} />
            ))}
          </div>
        </EmptyPopup>
        <div
          className={`${styles.photosContainer} ${
            styles[`container_${photoGridNumber}`]
          }`}
        >
          {outingPhotos[0] && !outingPhotos.find((img) => img === "queued") ? (
            outingPhotos.map((img) => (
              <div key={Math.random()} className={styles.imageContainer}>
                <img
                  onClick={(e) => onImageClick(img)}
                  key={Math.random()}
                  className={styles.image}
                  src={`data:image/png;base64,${img}`}
                  alt="feed-pic"
                />
              </div>
            ))
          ) : (
            <div style={{ padding: "1rem" }}>Loading Photos..</div>
          )}
        </div>
        <div className={styles.topContainer}>
          <div
            style={{ backgroundColor: activityColor }}
            className={styles.colorStripe}
          ></div>
          <div className={styles.topInnerContainer}>
            <div className={styles.innerContainerLeft}>
              <UserIconCluster
                onClick={onClusterClick}
                users={outing.users}
                sizeInRem={8}
                borderSizeInRem={0.8}
              />
              <div className={styles.outingDetailsContainer}>
                <div className={styles.outingMembers}>{memberNames}</div>
                <div className={styles.activityName}>
                  {outing.activity.name}
                </div>
                <div className={styles.buttonsContainer}>
                  <SimpleButton
                    onClick={onShowActivityPopup}
                    className={styles.viewActivityButton}
                    noShadow={true}
                  >
                    View Activity
                  </SimpleButton>
                </div>
              </div>
            </div>

            <img
              onClick={onLikeClick}
              src={liked ? heartFull : heart}
              className={styles.likeIcon}
              alt="feed-outing-icon"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default FeedCard;
