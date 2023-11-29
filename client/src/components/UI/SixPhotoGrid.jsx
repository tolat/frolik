import styles from "./styles/SixPhotoGrid.module.scss";
import closeIcon from "../../images/close.png";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";

const SixPhotoGrid = (props) => {
    const dispatch = useDispatch()
  const photoGridNumber = props.photos?.length > 6 ? 6 : props.photos?.length;

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  const photoList = props.photos.map((img) => (
    <div key={Math.random()} className={styles.imageContainer}>
      <img
        onClick={(e) => onImageClick(img)}
        key={Math.random()}
        className={`${styles.image}`}
        src={img}
        alt="feed-pic"
      />
      {props.showDeleteable &&
      props.deleteableIndexes?.find((i) => i === props.photos.indexOf(img)) +
        1 ? (
        <div
          onClick={() => props.onDeleteClick(props.photos.indexOf(img))}
          className={styles.deleteButton}
        >
          <img className={styles.deleteIcon} src={closeIcon} alt="close" />
        </div>
      ) : null}
    </div>
  ));

  


  return (
    <div
      className={`${styles.photosContainer} ${
        styles[`container_${photoGridNumber}`]
      }`}
    >
      {props.photos[0] && !props.photos.find((img) => img === "queued") ? (
        photoList
      ) : (
        <div style={{ padding: "1rem" }}>Loading Photos..</div>
      )}
    </div>
  );
};

export default SixPhotoGrid;
