import { useDispatch, useSelector } from "react-redux";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect, useState } from "react";
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
      <div className={styles.container}>
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
  const outingLikes = outing?.likes;
  const activityColor = categoryColorMap[outing?.activity?.category];
  const [liked, setLiked] = useState(
    outingLikes?.find((id) => id === user?._id)
  );
  const dispatch = useDispatch();
  const activityPopupSelector = `${outing?._id}-activity-popup`;
  const usersPopupSelector = `${outing?._id}-users-popup`;

  // Set liked for this outing
  useEffect(() => {
    setLiked(outingLikes?.find((id) => id === user._id));
  }, [outingLikes, user]);

  const onShowActivityPopup = () => {
    dispatch(popupActions.showPopup(activityPopupSelector));
  };

  const onLikeClick = () => {
    setLiked((prevState) => {
      const onComplete = (response) => {
        if (response.outing) {
          outing = response.outing;
        }
      };
      // update liked with prevestate
      setUserLike(user, outing, !prevState, onComplete);
      return !prevState;
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
              users={outing.users}
              sizeInRem={8}
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

          <StatIcon
            onClick={onLikeClick}
            icon={liked ? heartFull : heart}
            className={styles.likeIcon}
            iconStyle={{ width: "3rem", height: "3rem" }}
            alt="feed-outing-icon"
            rating={outing.likes?.length || null}
          />
        </div>
      </div>
    )
  );
};

export default FeedCard;
