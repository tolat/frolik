import { useLocation } from "react-router-dom";
import SlideInModal from "../Modals/SlideInModal";
import styles from "./styles/MainContainer.module.scss";
import { useEffect, useState } from "react";
import LinearLoader from "./LinearLoader";

const MainContainer = (props) => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const [marginBottom, setMarginBottom] = useState("");

  useEffect(() => {
    if (currentUrl.includes("login")) {
      setMarginBottom("0");
    } else {
      setMarginBottom("");
    }
  }, [currentUrl]);
  return (
    <div className={styles.outer} style={{ marginBottom: marginBottom }}>
      <div id="main-container" className={styles.inner}>
        <LinearLoader />
        <div
          id="main-container-children"
          className={`${styles.mainContainerChildren} noscroll`}
        >
          {props.children}
        </div>
        <SlideInModal />
      </div>
    </div>
  );
};

export default MainContainer;
