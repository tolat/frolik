import styles from "./styles/PhotoGrid.module.scss";
import closeIcon from "../../images/close.png";

const PhotoGrid = (props) => {
  return (
    <div
      style={{ gridTemplateColumns: props.gridTemplateColumns }}
      className={styles.container}
    >
      {props.images.map((m) => (
        <div key={Math.random()} className={styles.imageContainer}>
          <img
            className={styles.img}
            alt="userImage"
            src={`data:image/png;base64,${m}`}
          />
          {props.showDeleteable &&
          props.deleteableIndexes?.find((i) => i === props.images.indexOf(m)) +
            1 ? (
            <div
              onClick={() => props.onDeleteClick(props.images.indexOf(m))}
              className={styles.deleteButton}
            >
              <img className={styles.deleteIcon} src={closeIcon} alt="close" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
