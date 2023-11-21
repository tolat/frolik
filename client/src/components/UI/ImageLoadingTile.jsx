import styles from "./styles/ImageLoadingTile.module.scss";

const ImageLoadingTile = (props) => {
  return <div id={props.id} className={styles.container} />;
};

export default ImageLoadingTile;
