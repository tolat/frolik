import MainContainer from "../UI/MainContainer";
import styles from "./styles/Go.module.scss";

const Go = (props) => {
  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div>ME</div>
          <div>ADD</div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Go;
