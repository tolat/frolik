import { useLocation } from "react-router-dom";
import SlideInModal from "../Modals/SlideInModal";
import styles from "./styles/MainContainer.module.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PullToRefresh from "./PullToRefresh";
import { refreshPage } from "../../utils/pageRefresh";
import { onUpdateUser } from "../../store/socket-actions";
import { scrollPageTo, setPageScrollLocked } from "../../utils/pageScroll";

const MainContainer = (props) => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const [marginBottom, setMarginBottom] = useState("");
  const childrenRef = useRef(null);
  const loggedIn = useSelector((state) => !!state.auth.user);

  // Pull down on any page to refresh it: reloads the account, chats and
  // photos, plus whatever the page itself registers (usePageRefresh)
  const handleRefresh = () => {
    onUpdateUser();
    return refreshPage();
  };

  // Track modal open/close to apply overflow and opacity side-effects
  // (moved here from modal-slice reducer, which must stay pure)
  const modalMarginLeft = useSelector((state) => state.modal.marginLeft);
  const prevMarginLeft = useRef(modalMarginLeft);

  // Every page opens at the top (the router doesn't reset the scroll).
  // Layout effect: reset before the new page paints, so there's no jump.
  useLayoutEffect(() => {
    scrollPageTo(0);
  }, [currentUrl]);

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
      setPageScrollLocked(true);
      // Delay matches the modal slide-in animation duration
      const timer = setTimeout(() => {
        el.style.opacity = "0";
      }, 300);
      prevMarginLeft.current = modalMarginLeft;
      return () => clearTimeout(timer);
    }

    if (justClosed) {
      setPageScrollLocked(false);
      el.style.opacity = "1";
    }

    prevMarginLeft.current = modalMarginLeft;
  }, [modalMarginLeft]);

  return (
    <div className={styles.outer} style={{ marginBottom: marginBottom }}>
      <div id="main-container" className={styles.inner}>
        <PullToRefresh onRefresh={handleRefresh} disabled={!loggedIn}>
          <div
            ref={childrenRef}
            key={currentUrl}
            id="main-container-children"
            className={`${styles.mainContainerChildren} noscroll page-enter`}
          >
            {props.children}
          </div>
        </PullToRefresh>
        <SlideInModal />
      </div>
    </div>
  );
};

export default MainContainer;
