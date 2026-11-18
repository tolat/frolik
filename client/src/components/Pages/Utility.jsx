import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./styles/Auth.module.scss";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import { useState } from "react";
import { resetPassword, sendResetLink } from "../../utils/data-fetch";
import logo from "../../images/frolik2.png";

const Utility = (props) => {
  const navigate = useNavigate();
  const [resetUsername, setResetUsername] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [resetButtonText, setResetButtonText] = useState("Reset Password");
  const [sendLinkButtonText, setSendLinkButtonText] = useState("Send Link");
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

      setSendLinkButtonText("Send Link");
    };
    if (resetUsername && resetUsername !== "") {
      setSendLinkButtonText("Sending link…");
      sendResetLink(resetUsername, onComplete);
    }
  };

  const handleResetPassword = () => {
    // NEED TO CHECK PASSWORD VALIDITY
    const onComplete = (response) => {
      if (response.ok) {
        navigate("/password-reset-success");
      }
      setResetButtonText("Reset Password");
    };
    setResetButtonText("Resetting…");
    resetPassword(userID, resetToken, password, onComplete);
  };

  const headers = {
    "email-verified": "Email Address Verified!",
    "send-reset-password-link": "Forgot your password?",
    "reset-password-link-sent": "Reset Link Sent",
    "reset-password": "Reset Password",
    "password-reset-success": "Password Reset Successful!",
  };

  const messages = {
    "email-verified":
      "Your email address has been verified. You may now login with your username and password.",
    "send-reset-password-link":
      "Enter your email and we'll send you a link to reset it.",
    "reset-password-link-sent": "Check your email for the password reset link!",
    "reset-password": "Enter a new password below.",
    "password-reset-success": "You may now log in with your new password.",
  };

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
    "email-verified": loginButton("Go to Login"),
    "send-reset-password-link": (
      <>
        <div className={styles.fields}>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setResetUsername}
            label="Email"
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
          {sendLinkButtonText}
        </SimpleButton>
        <div className={`${styles.links} ${styles.center}`}>
          <button
            type="button"
            className={styles.link}
            onClick={handleGoToLoginClick}
          >
            Back to Login
          </button>
        </div>
      </>
    ),
    "reset-password-link-sent": loginButton("Back to Login"),
    "reset-password": (
      <>
        <div className={styles.fields}>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setPassword}
            label="New password"
            name="enter-new-password"
            type="password"
          ></SimpleInput>
          <SimpleInput
            defaultVal={""}
            setDataChanged={setConfirmPassword}
            label="Confirm password"
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
          {resetButtonText}
        </SimpleButton>
      </>
    ),
    "password-reset-success": loginButton("Go to Login"),
  };

  return (
    <div className={styles.page}>
      <img alt="frolik" src={logo} className={styles.logo} />
      <div className={styles.card}>
        <h1 className={styles.title}>{headers[props.page]}</h1>
        <p className={styles.subtitle}>{messages[props.page]}</p>
        {elements[props.page]}
      </div>
    </div>
  );
};

export default Utility;
