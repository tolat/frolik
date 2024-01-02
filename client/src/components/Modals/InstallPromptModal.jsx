import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/InstallPromptModal.module.scss";
import { useEffect, useState } from "react";
import {
  showAndroidInstallModal,
  showIosInstallModal,
} from "../../utils/utils";
import logo from "../../images/frolik2.png";
import install1 from "../../images/ios-install1.png";
import install2 from "../../images/ios-install2.png";
import safari from "../../images/safari.png";
import { modalActions } from "../../store/modal-slice";
import ModalPortal from "./ModalPortal";
import ModalHeaderPortal from "./ModalHeaderPortal";
import SimpleButton from "../UI/SimpleButton";

const InstallPromptModal = (props) => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "install-prompt" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [isIos, setIsIos] = useState(false);
  const installEvent = modalState.installPrompted;

  // Handle showing PWA install prompt
  useEffect(() => {
    const showPromptModal = () => {
      setTimeout(() => {
        dispatch(modalActions.setSelector("install-prompt"));
        dispatch(modalActions.showModal());
      }, 500);
    };

    if (showIosInstallModal("iOS-install-prompt")) {
      setIsIos(true);
      showPromptModal();
    } else if (
      installEvent &&
      showAndroidInstallModal("android-install-prompt")
    ) {
      setIsIos(false);
      showPromptModal();
    }
  }, [dispatch, installEvent]);

  const onInstallClick = () => {
    installEvent && installEvent.prompt();
    dispatch(modalActions.hideModal());
  };

  const header = (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        Install <img className={styles.logo} src={logo} alt="logo" />
      </div>
      <div className={styles.subHeader}>
        Installing Frolik will allow you to receive notifications and use Frolik
        like a regular mobile app.{" "}
      </div>
    </div>
  );

  const iOSMessage = (
    <div className={styles.messageContainer}>
      <h3>
        <div className={styles.safariContainer}>
          1. <img className={styles.safari} src={safari} alt="step1" />
          Use Safari to go to www.frolik.ca
        </div>
      </h3>
      <h3>2. Tap the share icon on the Safari toolbar</h3>
      <img className={styles.step} src={install1} alt="step1" />
      <h3>3. Tap 'Add to Home Screen'</h3>
      <img className={styles.step} src={install2} alt="step2" />
    </div>
  );

  const androidButton = (
    <SimpleButton onClick={onInstallClick} className={styles.installButton}>
      Install Frolik
    </SimpleButton>
  );

  return (
    <ModalPortal>
      <ModalHeaderPortal selector={"install-prompt"}>
        <div className={styles.continueButton}>Back to Frolik web </div>
      </ModalHeaderPortal>
      <div className={styles.container} style={modalStyle}>
        {header}
        {isIos ? iOSMessage : androidButton}
      </div>
    </ModalPortal>
  );
};

export default InstallPromptModal;
