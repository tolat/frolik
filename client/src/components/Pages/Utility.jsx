import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./styles/Auth.module.scss";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import { useState } from "react";
import { resetPassword, sendResetLink } from "../../utils/data-fetch";
import logo from "../../images/frolik2.png";
import { useT } from "../../i18n";

const Utility = (props) => {
  const navigate = useNavigate();
  const { t } = useT();
  const [resetUsername, setResetUsername] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const { userID } = useParams();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const passwordsEqual =
    password &&
    password !== "" &&
    confirmPassword &&
    confirmPassword !== "" &&
    password === confirmPassword;

  const handleGoToLoginClick = () => {
    navigate("/login");
  };

  const handleSendLink = () => {
    const onComplete = (response) => {
      if (response.ok) {
        navigate("/reset-password-link-sent");
      }

      setIsSendingLink(false);
    };
    if (resetUsername && resetUsername !== "") {
      setIsSendingLink(true);
      sendResetLink(resetUsername, onComplete);
    }
  };

  const handleResetPassword = () => {
    // NEED TO CHECK PASSWORD VALIDITY
    const onComplete = (response) => {
      if (response.ok) {
        navigate("/password-reset-success");
      }
      setIsResetting(false);
    };
    setIsResetting(true);
    resetPassword(userID, resetToken, password, onComplete);
  };

  // i18n keys per page (auth.utility.<key>.header / .message)
  const pageKeys = {
    "email-verified": "emailVerified",
    "send-reset-password-link": "sendResetLink",
    "reset-password-link-sent": "resetLinkSent",
    "reset-password": "resetPassword",
    "password-reset-success": "resetSuccess",
  };
  const pageKey = pageKeys[props.page];

  const hasEmail = resetUsername && resetUsername !== "";

  const loginButton = (text) => (
    <SimpleButton
      className={styles.primaryButton}
      noShadow={true}
      onClick={handleGoToLoginClick}
    >
      {text}
    </SimpleButton>
  );

  const elements = {
    "email-verified": loginButton(t("auth.utility.goToLogin")),
    "send-reset-password-link": (
      <>
        <div className={styles.fields}>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setResetUsername}
            label={t("auth.utility.email")}
            name="enter-username"
            type="email"
          ></SimpleInput>
        </div>
        <SimpleButton
          noShadow={true}
          className={`${styles.primaryButton} ${
            hasEmail ? "" : styles.disabled
          }`}
          onClick={hasEmail ? handleSendLink : null}
        >
          {isSendingLink
            ? t("auth.utility.sendingLink")
            : t("auth.utility.sendLink")}
        </SimpleButton>
        <div className={`${styles.links} ${styles.center}`}>
          <button
            type="button"
            className={styles.link}
            onClick={handleGoToLoginClick}
          >
            {t("auth.utility.backToLogin")}
          </button>
        </div>
      </>
    ),
    "reset-password-link-sent": loginButton(t("auth.utility.backToLogin")),
    "reset-password": (
      <>
        <div className={styles.fields}>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setPassword}
            label={t("auth.utility.newPassword")}
            name="enter-new-password"
            type="password"
          ></SimpleInput>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setConfirmPassword}
            label={t("auth.utility.confirmPassword")}
            name="confirm-password"
            type="password"
          ></SimpleInput>
        </div>
        <SimpleButton
          noShadow={true}
          className={`${styles.primaryButton} ${
            passwordsEqual ? "" : styles.disabled
          }`}
          onClick={passwordsEqual ? handleResetPassword : null}
        >
          {isResetting
            ? t("auth.utility.resetting")
            : t("auth.utility.resetPasswordButton")}
        </SimpleButton>
      </>
    ),
    "password-reset-success": loginButton(t("auth.utility.goToLogin")),
  };

  return (
    <div className={styles.page}>
      <img alt="frolik" src={logo} className={styles.logo} />
      <div className={styles.card}>
        <h1 className={styles.title}>
          {pageKey && t(`auth.utility.${pageKey}.header`)}
        </h1>
        <p className={styles.subtitle}>
          {pageKey && t(`auth.utility.${pageKey}.message`)}
        </p>
        {elements[props.page]}
      </div>
    </div>
  );
};

export default Utility;
