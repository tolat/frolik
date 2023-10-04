import styles from "./styles/PhotoGrid.module.scss";

const PhotoGrid = (props) => {
  return (
    <div
      style={{ gridTemplateColumns: props.gridTemplateColumns }}
      className={styles.container}
    >
      {props.images.map((m) => (
        <img key={m.key} className={styles.img} alt="userImage" src={m.url} />
      ))}
    </div>
  );
};

export default PhotoGrid;
