import { useState, useCallback, useRef } from "react";
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

  const firstLoadFired = useRef(false);
  // Tracks images already processed via the ref callback (for cached images).
  // Using a ref avoids re-render loops — the ref is mutated, not state.
  const completeChecked = useRef(new Set());

  const handleLoad = useCallback((src) => {
    setLoadedSet((prev) => new Set([...prev, src]));
    if (!firstLoadFired.current) {
      firstLoadFired.current = true;
      props.onFirstLoad?.();
    }
  }, [props.onFirstLoad]);

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  // photos prop not yet provided — still loading from server
  if (props.photos == null) {
    return (
      <div className={`${styles.photosContainer} ${styles.container_1}`}>
        <div className={styles.imageContainer}>
          <ImageLoadingTile />
        </div>
      </div>
    );
  }

  // photos provided but empty — nothing to render
  if (props.photos.length === 0) {
    return null;
  }

  // An upload is in progress — show shimmer while the queued item resolves
  if (hasQueued) {
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
          ref={(el) => {
            if (el?.complete && !completeChecked.current.has(img)) {
              completeChecked.current.add(img);
              handleLoad(img);
            }
          }}
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
