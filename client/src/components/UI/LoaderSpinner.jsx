import styles from "./styles/LoaderSpinner.module.scss";

const LoaderSpinner = (props) => {
  console.log(props.width, props.height);
  return (
    <div id={props.id} className={`${styles.container} ${props.className}`}>
      <span
        style={{ width: props.width, height: props.height }}
        className={styles.loader}
      ></span>
    </div>
  );
};

export default LoaderSpinner;
