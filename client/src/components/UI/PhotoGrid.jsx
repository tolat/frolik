import styles from "./styles/PhotoGrid.module.scss";
import closeIcon from "../../images/close.png";
import PhotoPopup from "../Popups/PhotoPopup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { popupActions } from "../../store/popup-slice";

const PhotoGrid = (props) => {
  const [activeImage, setActiveImage] = useState(false);
  const dispatch = useDispatch();

  const onImageClick = (img) => {
    setActiveImage(img);
    dispatch(popupActions.showPopup("view-image"));
  };

  return (
    <div
      style={{ gridTemplateColumns: props.gridTemplateColumns }}
      className={styles.container}
    >
      <PhotoPopup selector={"view-image"} image={activeImage} />
      {props.images.map(
        (m) =>
          m && (
            <div
              onClick={() => onImageClick(m)}
              key={Math.random()}
              className={styles.imageContainer}
            >
              <img
                className={styles.img}
                alt="userImage"
                src={`data:image/png;base64,${m}`}
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
