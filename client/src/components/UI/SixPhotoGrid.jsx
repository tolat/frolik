import { useState, useCallback } from "react";
import styles from "./styles/SixPhotoGrid.module.scss";
import closeIcon from "../../images/close.png";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import ImageLoadingTile from "./ImageLoadingTile";

const SixPhotoGrid = (props) => {
  const dispatch = useDispatch();
  const [loadedSet, setLoadedSet] = useState(new Set());
  const photoGridNumber = props.photos?.length > 6 ? 6 : props.photos?.length;
  const hasQueued = props.photos?.find((img) => img === "queued");

  const handleLoad = useCallback((src) => {
    setLoadedSet((prev) => new Set([...prev, src]));
  }, []);

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  // Show a shimmer tile while photos are still being fetched from the server
  if (!props.photos?.[0] || hasQueued) {
    return (
      <div className={`${styles.photosContainer} ${styles.container_1}`}>
        <div className={styles.imageContainer}>
          <ImageLoadingTile />
        </div>
      </div>
    );
  }

  const photoList = props.photos.slice(0, 6).map((img) => {
    const loaded = loadedSet.has(img);
    return (
      <div
        onClick={props.onClick}
        key={img}
        className={styles.imageContainer}
      >
        {/* Shimmer placeholder sits behind the image until it finishes loading */}
        {!loaded && (
          <div className={styles.loadingOverlay}>
            <ImageLoadingTile />
          </div>
        )}
        <img
          onLoad={() => handleLoad(img)}
          onClick={props.onClick ? null : () => onImageClick(img)}
          className={`${styles.image} ${
            props.noRoundedCornerLeft ? styles.noRoundedCornerLeft : null
          } ${loaded ? styles.imageLoaded : styles.imageLoading}`}
          src={img}
          alt="feed-pic"
        />
        {props.showDeleteable &&
        props.deleteableIndexes?.find(
          (i) => i === props.photos.indexOf(img)
        ) + 1 ? (
          <div
            onClick={() => props.onDeleteClick(props.photos.indexOf(img))}
            className={styles.deleteButton}
          >
            <img className={styles.deleteIcon} src={closeIcon} alt="close" />
          </div>
        ) : null}
      </div>
    );
  });

  return (
    <div
      className={`${styles.photosContainer} ${
        styles[`container_${photoGridNumber}`]
      }`}
    >
      {photoList}
    </div>
  );
};

export default SixPhotoGrid;
