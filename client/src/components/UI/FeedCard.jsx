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
  const user = useSelector((state) => state.auth.user);
  const outing = props.outing;
  const cachedPhotos = useSelector((state) => state.data.cachedPhotos);
  const outingPhotos = outing?.photos.map((p) => cachedPhotos[p.key]);
  const photoGridNumber = outingPhotos?.length > 6 ? 6 : outingPhotos?.length;
  const dispatch = useDispatch();
  const outingUsers = outing?.users;

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
      if (!cachedPhotos[photo.key]) {
        fetchOutingPhoto(outing, photo.key, (photoString) =>
          onComplete(photo.key, photoString)
        );
      }
    }
  }, [user, outing, dispatch, cachedPhotos]);

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

  const photoList = outingPhotos.map((img) => (
    <div key={Math.random()} className={styles.imageContainer}>
      <img
        onClick={(e) => onImageClick(img)}
        key={Math.random()}
        className={`${styles.image}`}
        src={img}
        alt="feed-pic"
      />
    </div>
  ));

  return (
    outing && (
      <div className={styles.container}>
        <div
          className={`${styles.photosContainer} ${
            styles[`container_${photoGridNumber}`]
          }`}
        >
          {outingPhotos[0] && !outingPhotos.find((img) => img === "queued") ? (
            photoList
          ) : (
            <div style={{ padding: "1rem" }}>Loading Photos..</div>
          )}
        </div>
        <FeedCardFooter outing={outing} memberNames={memberNames} />
      </div>
    )
  );
};

const FeedCardFooter = (props) => {
  const globals = useSelector((state) => state.auth.globals);
  const categoryColorMap = globals.categoryColorMap;
  const activityColor = categoryColorMap[props.outing?.activity?.category];
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  const activityPopupSelector = `${props.outing?._id}-activity-popup`;
  const usersPopupSelector = `${props.outing?._id}-users-popup`;

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
    <div className={styles.topContainer}>
      <EmptyPopup selector={activityPopupSelector}>
        <ActivityCard
          showInstructions={true}
          activity={props.outing.activity}
          hideSelect={true}
        />
      </EmptyPopup>
      <EmptyPopup selector={usersPopupSelector}>
        <div className={styles.friendsPopupContainer}>
          <h2 className={styles.friendsPopupHeader}>Outing Members</h2>
          {props.outing.users.map((u) => (
            <FriendCard key={Math.random()} user={u} />
          ))}
        </div>
      </EmptyPopup>
      <div
        style={{ backgroundColor: activityColor }}
        className={styles.colorStripe}
      ></div>
      <div className={styles.topInnerContainer}>
        <div className={styles.innerContainerLeft}>
          <UserIconCluster
            onClick={onClusterClick}
            users={props.outing.users}
            sizeInRem={8}
            borderSizeInRem={0.8}
          />
          <div className={styles.outingDetailsContainer}>
            <div className={styles.outingMembers}>{props.memberNames}</div>
            <div className={styles.activityName}>
              {props.outing.activity.name}
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
  );
};

export default FeedCard;
