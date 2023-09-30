import styles from "./styles/MainContainer.module.scss";

const MainContainer = (props) => {
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>{props.children}</div>
    </div>
  );
};

export default MainContainer;
