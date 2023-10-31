import SlideInModal from "../Modals/SlideInModal";
import styles from "./styles/MainContainer.module.scss";

const MainContainer = (props) => {
  return (
    <div className={styles.outer}>
      <div id="main-container" className={styles.inner}>
         {props.children}
          <SlideInModal />
      </div>
    </div>
  );
};

export default MainContainer;
