import { useLocation } from "react-router-dom";
import SlideInModal from "../Modals/SlideInModal";
import styles from "./styles/MainContainer.module.scss";
import { useEffect, useState } from "react";
import LinearLoader from "./LinearLoader";
import { onUpdateUser } from "../../store/socket-actions";

const MainContainer = (props) => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const [marginBottom, setMarginBottom] = useState("");
  const [touchStart, setTouchStart] = useState(false);

  // Add listeners to implement pull to refresh
  useEffect(() => {
    const onTouchStart = (e) => setTouchStart(e.touches[0].clientY);
    const onTouchEnd = (e) => {
      if (
        window.scrollY === 0 &&
        touchStart &&
        e.changedTouches[0].clientY - touchStart > 500
      ) {
        navigator.vibrate(100)
        onUpdateUser();
      }
      setTouchStart(false);
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  });

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
