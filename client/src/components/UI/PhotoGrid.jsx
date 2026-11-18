import styles from "./styles/PhotoGrid.module.scss";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import { memo } from "react";
import ImageLoadingTile from "./ImageLoadingTile";
import useIncrementalList from "../../utils/useIncrementalList";
import ListSentinel from "./ListSentinel";
import { useT } from "../../i18n";

const PhotoGrid = memo((props) => {
  const { t } = useT();
  const dispatch = useDispatch();
  const { visible, hasMore, sentinelRef } = useIncrementalList(
    props.images,
    props.pageSize || 15
  );

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  const onImageLoad = (e, id) => {
    e.target.classList.remove("hidden");
    document.getElementById(id).classList.add("hidden");
  };

  return (
    <>
    <div
      style={{ gridTemplateColumns: props.gridTemplateColumns, ...props.style }}
      className={styles.container}
    >
      {visible.map(
        (m, index) =>
          m && (
            <div key={index} className={styles.imageContainer}>
              <ImageLoadingTile id={m} />
              <img
                onClick={() => onImageClick(m)}
                onLoad={(e) => onImageLoad(e, m)}
                className={`${styles.img} hidden`}
                alt={t("ui.photos.userPhoto")}
                src={m}
              />
            </div>
          )
      )}
    </div>
    <ListSentinel ref={sentinelRef} hasMore={hasMore} />
    </>
  );
});

export default PhotoGrid;
