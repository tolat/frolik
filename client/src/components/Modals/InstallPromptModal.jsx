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
import { hideModal } from "../../store/modal-actions";
import { useT, T } from "../../i18n";

const InstallPromptModal = (props) => {
  const { t } = useT();
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
    hideModal(true)
  };

  const header = (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        <T
          k="install.header"
          components={{
            logo: <img className={styles.logo} src={logo} alt="logo" />,
          }}
        />
      </div>
      <div className={styles.subHeader}>
        {t("install.subHeader")}
      </div>
    </div>
  );

  const iOSMessage = (
    <div className={styles.messageContainer}>
      <h3>
        <div className={styles.safariContainer}>
          <T
            k="install.ios.step1"
            components={{
              safari: (
                <img
                  className={styles.safari}
                  src={safari}
                  alt={t("install.ios.step1Alt")}
                />
              ),
            }}
          />
        </div>
      </h3>
      <h3>{t("install.ios.step2")}</h3>
      <img
        className={styles.step}
        src={install1}
        alt={t("install.ios.step1Alt")}
      />
      <h3>{t("install.ios.step3")}</h3>
      <img
        className={styles.step}
        src={install2}
        alt={t("install.ios.step2Alt")}
      />
    </div>
  );

  const androidButton = (
    <SimpleButton onClick={onInstallClick} className={styles.installButton}>
      {t("install.installButton")}
    </SimpleButton>
  );

  return (
    <ModalPortal>
      <ModalHeaderPortal selector={"install-prompt"}>
        <div className={styles.continueButton}>{t("install.backToWeb")} </div>
      </ModalHeaderPortal>
      <div className={styles.container} style={modalStyle}>
        {header}
        {isIos ? iOSMessage : androidButton}
      </div>
    </ModalPortal>
  );
};

export default InstallPromptModal;
