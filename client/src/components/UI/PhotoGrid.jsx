import styles from "./styles/PhotoGrid.module.scss";
import closeIcon from "../../images/close.png";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";

const PhotoGrid = (props) => {
  const dispatch = useDispatch();

  const onImageClick = (img) => {
    dispatch(popupActions.setPopupImage(img));
    dispatch(popupActions.showPopup("view-photo"));
  };

  return (
    <div
      style={{ gridTemplateColumns: props.gridTemplateColumns }}
      className={styles.container}
    >
      {props.images.map(
        (m) =>
          m && (
            <div
              onClick={() => onImageClick(m)}
              key={Math.random()}
              className={styles.imageContainer}
            >
              <img
                onLoad={(e) => e.target.classList.remove(`hidden`)}
                className={`${styles.img} hidden`}
                alt="userImage"
                src={m}
              />
              {props.showDeleteable &&
              props.deleteableIndexes?.find(
                (i) => i === props.images.indexOf(m)
              ) + 1 ? (
                <div
                  onClick={() => props.onDeleteClick(props.images.indexOf(m))}
                  className={styles.deleteButton}
                >
                  <img
                    className={styles.deleteIcon}
                    src={closeIcon}
                    alt="close"
                  />
                </div>
              ) : null}
            </div>
          )
      )}
    </div>
  );
};

export default PhotoGrid;
