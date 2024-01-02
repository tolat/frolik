import { useDispatch, useSelector } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import styles from "./styles/InstallPrompt.module.scss";
import WarningPopup from "./WarningPopup";
import { useEffect } from "react";
import { showIosInstallModal } from "../../utils/utils";
import logo from "../../images/frolik2.png";
import install1 from "../../images/ios-install1.png";
import install2 from "../../images/ios-install2.png";
import safari from "../../images/safari.png";

const InstallPrompt = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === "install-prompt";
  const popupDisplay = showPopup ? "flex" : "none";

  // Handle showing PWA install prompt
  useEffect(() => {
    if (user) {
      if (showIosInstallModal("iOS-install-prompt")) {
        console.log("showing prompt");
        dispatch(popupActions.showPopup("install-prompt"));
      }
    }
  }, [user, dispatch]);

  const handleClosePopup = () => {
    dispatch(popupActions.hidePopup());
  };

  const installHeader = (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        Get <img className={styles.logo} src={logo} alt="logo" /> notifications!
      </div>
      <div className={styles.subHeader}>
        Install on your device to receive notifications {"(iOS > 16.4)"}.
      </div>
    </div>
  );

  const installMessage = (
    <div className={styles.messageContainer}>
      <h3>
        <div className={styles.safariContainer}>
          1. <img className={styles.safari} src={safari} alt="step1" />
          Use Safari to go to www.frolik.ca
        </div>
      </h3>
      <h3>2. Tap the share icon on your browser toolbar</h3>
      <img className={styles.step} src={install1} alt="step1" />
      <h3>3. Tap 'Add to Home Screen'</h3>
      <img className={styles.step} src={install2} alt="step2" />
    </div>
  );

  return (
    <div className={styles.container} style={{ display: popupDisplay }}>
      <WarningPopup
        selector={"install-prompt"}
        header={installHeader}
        message={installMessage}
        ok={"OK"}
        okClick={handleClosePopup}
      />
    </div>
  );
};

export default InstallPrompt;
