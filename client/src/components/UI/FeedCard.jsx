import { useDispatch, useSelector } from "react-redux";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect, useRef, useState } from "react";
import {
  fetchOutingPhoto,
  fetchProfilePic,
  setUserLike,
} from "../../utils/data-fetch";
import { dataActions } from "../../store/data-slice";
import SimpleButton from "./SimpleButton";
import heart from "../../images/heart.png";
import heartFull from "../../images/heart2.png";
import { popupActions } from "../../store/popup-slice";
import EmptyPopup from "../Popups/EmptyPopup";
import ActivityCard from "./ActivityCard";
import FriendCard from "./FriendCard";
import StatIcon from "./StatIcon";
import SixPhotoGrid from "./SixPhotoGrid";
import LoaderSpinner from "./LoaderSpinner";

const FeedCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const outing = props.outing;
  const cachedPhotos = useSelector((state) => state.data.cachedPhotos);
  const userData = useSelector((state) => state.data.users[user._id]);
  const outingPhotos = outing?.photos.map(
    (p) =>
      cachedPhotos[p.key] ||
      userData.photos.find((photo) => photo.key === p.key)?.photo
  );
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
      fetchOutingPhoto(outing, photo.key, (photoString) =>
        onComplete(photo.key, photoString)
      );
    }
  }, [user, outing, dispatch, cachedPhotos, userData]);

  // Get missing profile pictures from server
  useEffect(() => {
    for (let u of outingUsers) {
      fetchProfilePic(u._id);
    }
  }, [outingUsers]);

  return (
    outing && (
      <div className={`${styles.container} fade-in`}>
        {outing && outingPhotos[0] && !outingPhotos.find((img) => img === "queued") ? (
          <SixPhotoGrid photos={outingPhotos} />
        ) : (
          <div className={styles.loadingTile}>
            Loading Photos.. &nbsp;{" "}
            <LoaderSpinner width="1.5rem" height="1.5rem" />
          </div>
        )}

        <FeedCardFooter outing={outing} memberNames={memberNames} />
      </div>
    )
  );
};

const FeedCardFooter = (props) => {
  const globals = useSelector((state) => state.auth.globals);
  let outing = props.outing;
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = globals.categoryColorMap;
  const activityColor = categoryColorMap ? categoryColorMap[outing?.activity?.category] : null;
  // Local copy of the like list so the heart + count update instantly
  const [likes, setLikes] = useState(outing?.likes || []);
  const liked = likes.some((id) => id === user?._id);
  const heartRef = useRef(null);
  const propLikesKey = (outing?.likes || []).join(",");
  const dispatch = useDispatch();
  const activityPopupSelector = `${outing?._id}-activity-popup`;
  const usersPopupSelector = `${outing?._id}-users-popup`;

  // Re-sync when fresh outing data arrives from the server
  useEffect(() => {
    setLikes(propLikesKey ? propLikesKey.split(",") : []);
  }, [propLikesKey]);

  const onShowActivityPopup = () => {
    dispatch(popupActions.showPopup(activityPopupSelector));
  };

  const onLikeClick = () => {
    const nextLiked = !liked;
    const previous = likes;

    // Optimistic update (the request used to be fired from inside a state
    // updater, which React may run twice, and the count never refreshed)
    setLikes(
      nextLiked ? [...likes, user._id] : likes.filter((id) => id !== user._id)
    );

    // Pop the heart for feedback
    heartRef.current?.querySelector("img")?.animate?.(
      [
        { transform: "scale(1)" },
        { transform: `scale(${nextLiked ? 1.45 : 0.8})`, offset: 0.35 },
        { transform: `scale(${nextLiked ? 0.92 : 1.05})`, offset: 0.7 },
        { transform: "scale(1)" },
      ],
      { duration: 420, easing: "ease-out" }
    );

    setUserLike(user, outing, nextLiked, (response) => {
      if (response?.outing) {
        setLikes(response.outing.likes || []);
      } else {
        setLikes(previous); // request failed — roll back
      }
    });
  };

  const onClusterClick = () => {
    dispatch(popupActions.showPopup(usersPopupSelector));
  };
  return (
    outing && (
      <div className={styles.topContainer}>
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
              <FriendCard key={u._id} user={u} />
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
              users={outing.users}
              sizeInRem={8.5}
              borderSizeInRem={0.8}
            />
            <div className={styles.outingDetailsContainer}>
              <div className={styles.outingMembers}>{props.memberNames}</div>
              <div className={styles.activityName}>{outing.activity.name}</div>
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

          <div ref={heartRef} className={styles.likeWrapper}>
            <StatIcon
              onClick={onLikeClick}
              icon={liked ? heartFull : heart}
              className={styles.likeIcon}
              iconStyle={{ width: "3rem", height: "3rem" }}
              alt="like"
              rating={likes.length || null}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default FeedCard;
