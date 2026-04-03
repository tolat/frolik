import { useLocation } from "react-router-dom";
import SlideInModal from "../Modals/SlideInModal";
import styles from "./styles/MainContainer.module.scss";
import { useEffect, useRef, useState } from "react";
import LinearLoader from "./LinearLoader";
import { useSelector } from "react-redux";

const MainContainer = (props) => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const [marginBottom, setMarginBottom] = useState("");
  const childrenRef = useRef(null);

  // Track modal open/close to apply overflow and opacity side-effects
  // (moved here from modal-slice reducer, which must stay pure)
  const modalMarginLeft = useSelector((state) => state.modal.marginLeft);
  const prevMarginLeft = useRef(modalMarginLeft);

  useEffect(() => {
    if (currentUrl.includes("login")) {
      setMarginBottom("0");
    } else {
      setMarginBottom("");
    }
  }, [currentUrl]);

  useEffect(() => {
    const el = childrenRef.current;
    if (!el) return;

    const justOpened =
      modalMarginLeft === "0%" && prevMarginLeft.current !== "0%";
    const justClosed =
      modalMarginLeft !== "0%" && prevMarginLeft.current === "0%";

    if (justOpened) {
      document.documentElement.style.overflowY = "clip";
      // Delay matches the modal slide-in animation duration
      const timer = setTimeout(() => {
        el.style.opacity = "0";
      }, 300);
      prevMarginLeft.current = modalMarginLeft;
      return () => clearTimeout(timer);
    }

    if (justClosed) {
      document.documentElement.style.overflowY = null;
      el.style.opacity = "1";
    }

    prevMarginLeft.current = modalMarginLeft;
  }, [modalMarginLeft]);

  return (
    <div className={styles.outer} style={{ marginBottom: marginBottom }}>
      <div id="main-container" className={styles.inner}>
        <LinearLoader />
        <div
          ref={childrenRef}
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
