import { useDispatch, useSelector } from "react-redux";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect } from "react";
import { fetchOutingPhoto, fetchProfilePic } from "../../utils/data-fetch";
import { dataActions } from "../../store/data-slice";
import SimpleButton from "./SimpleButton";
import balloon from "../../images/air-balloon.png";
import { popupActions } from "../../store/popup-slice";

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
    props.setPopupImage(img);
    dispatch(popupActions.showPopup("view-feed-image"));
  };

  // Get missing profile pictures from server
  useEffect(() => {
    for (let u of outingUsers) {
      fetchProfilePic(u._id);
    }
  }, [outingUsers]);

  return (
    outing && (
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div
            style={{ backgroundColor: activityColor }}
            className={styles.colorStripe}
          ></div>
          <div className={styles.topInnerContainer}>
            <div className={styles.innerContainerLeft}>
              <UserIconCluster
                users={outing.users}
                sizeInRem={8}
                borderSizeInRem={0.8}
              />
              <div className={styles.outingDetailsContainer}>
                <div className={styles.outingMembers}>
                  {outing.users.map((u) => `${u.first_name}, `)}
                </div>
                <div className={styles.activityName}>
                  {outing.activity.name}
                </div>
              </div>
            </div>

            <img
              src={balloon}
              className={styles.outingIcon}
              alt="feed-outing-icon"
            />
          </div>
        </div>
        <div
          className={`${styles.photosContainer} ${
            styles[`container_${photoGridNumber}`]
          }`}
        >
          {outingPhotos.map((img) =>
            img && img !== "queued" ? (
              <div className={styles.imageContainer}>
                <img
                  onClick={(e) => onImageClick(img)}
                  key={Math.random()}
                  className={styles.image}
                  src={`data:image/png;base64,${img}`}
                  alt="feed-pic"
                />
              </div>
            ) : (
              <div style={{ padding: "1rem" }}>Loading Photos..</div>
            )
          )}
        </div>
      </div>
    )
  );
};

export default FeedCard;
