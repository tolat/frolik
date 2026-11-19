import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./styles/SixPhotoGrid.module.scss";
import closeIcon from "../../images/close.png";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import ImageLoadingTile from "./ImageLoadingTile";
import { useT } from "../../i18n";
import { isVideoUrl } from "../../utils/media";
import VideoBadge from "./VideoBadge";

const SixPhotoGrid = (props) => {
  const { t } = useT();
  const dispatch = useDispatch();
  const [loadedSet, setLoadedSet] = useState(new Set());
  // Photos whose image failed to load are dropped from the grid entirely
  // (previously the browser showed the alt text + a broken-image icon)
  const [failedSet, setFailedSet] = useState(new Set());
  const handleError = useCallback((src) => {
    setFailedSet((prev) => new Set([...prev, src]));
  }, []);
  const visiblePhotos = (props.photos || []).filter(
    (img) => img && img !== "queued" && !failedSet.has(img)
  );
  const photoGridNumber = Math.min(visiblePhotos.length, 6);

  // Tell the parent once every shown photo has loaded (or failed and been
  // dropped), so it can reveal the whole card at once
  const allLoadedFired = useRef(false);
  const shown = visiblePhotos.slice(0, 6);
  const allSettled =
    props.photos != null &&
    !props.photos.some((img) => img === "queued") &&
    shown.every((img) => loadedSet.has(img));
  useEffect(() => {
    if (allSettled && !allLoadedFired.current) {
      allLoadedFired.current = true;
      props.onAllLoaded?.();
    }
  });
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

  // Every photo failed to load — show a simple placeholder instead
  if (visiblePhotos.length === 0) {
    return (
      <div className={`${styles.photosContainer} ${styles.container_1}`}>
        <div className={`${styles.imageContainer} ${styles.noPhoto}`}>
          <svg viewBox="0 0 24 24" className={styles.noPhotoIcon} aria-hidden="true">
            <path
              d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-1.8A1.5 1.5 0 0 1 10.55 3.5h2.9a1.5 1.5 0 0 1 1.25.7L15.9 6h1.6A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span>{t("ui.photos.none")}</span>
        </div>
      </div>
    );
  }

  const photoList = visiblePhotos.slice(0, 6).map((img) => {
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
        {isVideoUrl(img) ? (
          <>
            <video
              ref={(el) => {
                if (el && el.readyState >= 2 && !completeChecked.current.has(img)) {
                  completeChecked.current.add(img);
                  handleLoad(img);
                }
              }}
              onLoadedData={() => handleLoad(img)}
              onError={() => handleError(img)}
              onClick={props.onClick ? null : () => onImageClick(img)}
              className={`${styles.image} ${
                props.noRoundedCornerLeft ? styles.noRoundedCornerLeft : null
              } ${loaded ? styles.imageLoaded : styles.imageLoading}`}
              src={img}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            />
            <VideoBadge />
          </>
        ) : (
          <img
            ref={(el) => {
              if (el?.complete && !completeChecked.current.has(img)) {
                completeChecked.current.add(img);
                handleLoad(img);
              }
            }}
            onLoad={() => handleLoad(img)}
            onError={() => handleError(img)}
            onClick={props.onClick ? null : () => onImageClick(img)}
            className={`${styles.image} ${
              props.noRoundedCornerLeft ? styles.noRoundedCornerLeft : null
            } ${loaded ? styles.imageLoaded : styles.imageLoading}`}
            src={img}
            loading={props.eager ? "eager" : "lazy"}
            decoding="async"
            alt=""
          />
        )}
        {props.showDeleteable &&
        props.deleteableIndexes?.find(
          (i) => i === props.photos.indexOf(img)
        ) + 1 ? (
          <div
            onClick={() => props.onDeleteClick(props.photos.indexOf(img))}
            className={styles.deleteButton}
          >
            <img className={styles.deleteIcon} src={closeIcon} alt={t("ui.photos.remove")} />
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
