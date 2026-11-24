import { useDispatch, useSelector } from "react-redux";
import { shineSync } from "../../utils/shine";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect, useRef, useState } from "react";
import {
  fetchOutingPhoto,
  fetchProfilePic,
  setUserLike,
  fetchActivityDetails,
} from "../../utils/data-fetch";
import { dataActions } from "../../store/data-slice";
import SimpleButton from "./SimpleButton";
import heart from "../../images/heart.png";
import heartFull from "../../images/heart2.png";
import { popupActions } from "../../store/popup-slice";
import EmptyPopup from "../Popups/EmptyPopup";
import FriendCard from "./FriendCard";
import StatIcon from "./StatIcon";
import SixPhotoGrid from "./SixPhotoGrid";
import { SkeletonCard } from "./SkeletonCards";
import { useT } from "../../i18n";

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
  // Whole-card loading tile until the photos are in (8s safety net)
  const [ready, setReady] = useState(!outing?.photos?.length);
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setReady(true), 8000);
    return () => clearTimeout(timer);
  }, [ready]);

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
      <div
        className={`${styles.container} ${
          ready ? "tile-ready" : `tile-loading has-skeleton ${styles.loadingSize}`
        }`}
        style={ready ? undefined : shineSync()}
      >
        {/* (redesign) post layout: the photos, then who + what, then like / view */}
        {outing && outingPhotos[0] && !outingPhotos.find((img) => img === "queued") ? (
          <SixPhotoGrid photos={outingPhotos} onAllLoaded={() => setReady(true)} />
        ) : (
          <div className={`${styles.loadingTile} shine-loading`} />
        )}

        <FeedCardFooter outing={outing} memberNames={memberNames} part="header" />
        <FeedCardFooter outing={outing} memberNames={memberNames} part="actions" />
        {!ready && <SkeletonCard variant="feed" fill />}
      </div>
    )
  );
};

const FeedCardFooter = (props) => {
  const { t } = useT();
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
  const usersPopupSelector = `${outing?._id}-users-popup`;

  // Re-sync when fresh outing data arrives from the server
  useEffect(() => {
    setLikes(propLikesKey ? propLikesKey.split(",") : []);
  }, [propLikesKey]);

  // Open the full activity (with its photo, when it has one) in the shared
  // activity popup — the same one chat messages open
  const [openingActivity, setOpeningActivity] = useState(false);
  const onShowActivityPopup = () => {
    const activityID = outing?.activity?._id;
    if (!activityID || openingActivity) return;
    setOpeningActivity(true);
    fetchActivityDetails(activityID, (full) => {
      setOpeningActivity(false);
      dispatch(popupActions.setSharedActivity(full || outing.activity));
      dispatch(popupActions.showPopup("shared-activity"));
    });
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
        {props.part === "header" && (
        <EmptyPopup selector={usersPopupSelector}>
          <div className={styles.friendsPopupContainer}>
            <h2 className={styles.friendsPopupHeader}>
              {t("ui.feedCard.members")}
            </h2>
            {outing.users.map((u) => (
              <FriendCard key={u._id} user={u} restrictProfile={true} />
            ))}
          </div>
        </EmptyPopup>
        )}
        {props.part === "header" ? (
          <div className={styles.postHeader}>
            <UserIconCluster
              onClick={onClusterClick}
              users={outing.users}
              sizeInRem={4.8}
              borderSizeInRem={0.4}
            />
            <div className={styles.outingDetailsContainer}>
              <div className={styles.outingMembers}>{props.memberNames}</div>
              <div className={styles.activityName}>
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: activityColor }}
                />
                {outing.activity.name}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.postActions}>
            <div ref={heartRef} className={styles.likeWrapper}>
              <StatIcon
                onClick={onLikeClick}
                icon={liked ? heartFull : heart}
                className={styles.likeIcon}
                iconStyle={{ width: "2.6rem", height: "2.6rem" }}
                alt={liked ? t("ui.feedCard.unlike") : t("ui.feedCard.like")}
                rating={likes.length || null}
              />
            </div>
            <SimpleButton
              onClick={onShowActivityPopup}
              className={styles.viewActivityButton}
              noShadow={true}
            >
              {t("ui.feedCard.viewActivity")}
            </SimpleButton>
          </div>
        )}
      </div>
    )
  );
};

export default FeedCard;
