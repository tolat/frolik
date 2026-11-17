import { shineSync } from "../../utils/shine";
import styles from "./styles/ImageLoadingTile.module.scss";

const ImageLoadingTile = (props) => {
  return (
    <div
      id={props.id}
      className={`${styles.container} shine-loading`}
      style={shineSync()}
    ></div>
  );
};

export default ImageLoadingTile;
