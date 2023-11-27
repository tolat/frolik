import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/Utility.module.scss";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import { useState } from "react";
import { resetPassword, sendResetLink } from "../../utils/data-fetch";

const Utility = (props) => {
  const navigate = useNavigate();
  const [resetUsername, setResetUsername] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [resetButtonText, setResetButtonText] = useState("Reset Password");
  const [sendLinkButtonText, setSendLinkButtonText] = useState("Send Link");
  const { userID } = useParams();
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
      setSendLinkButtonText("Sending Link..");
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
    setResetButtonText("Resetting..");
    resetPassword(userID, password, onComplete);
  };

  const headers = {
    "email-verified": "Email Address Verified!",
    "send-reset-password-link": "Enter Account Email",
    "reset-password-link-sent": "Reset Link Sent",
    "reset-password": "Reset Password",
    "password-reset-success": "Password Reset Successful!",
  };

  const messages = {
    "email-verified":
      "Your email address has been verified. You may now login with your username and password.",
    "send-reset-password-link":
      "A link to reset your password will be sent to your email.",
    "reset-password-link-sent": "Check your email for the password reset link!",
    "reset-password": "Enter a new password below.",
    "password-reset-success": "You may now log in with your new password.",
  };

  const elements = {
    "email-verified": (
      <SimpleButton
        className={styles.actionButton}
        noShadow={true}
        onClick={handleGoToLoginClick}
      >
        Go to Login
      </SimpleButton>
    ),
    "send-reset-password-link": (
      <div className={styles.sendResetLinkElements}>
        <SimpleInput
          defaultVal={""}
          setDataChanged={setResetUsername}
          label="Enter Email"
          name="enter-username"
        ></SimpleInput>
        <SimpleButton
          noShadow={true}
          className={
            !resetUsername || resetUsername === ""
              ? styles.unclickable
              : styles.actionButton
          }
          onClick={
            resetUsername && resetUsername !== "" ? handleSendLink : null
          }
        >
          {sendLinkButtonText}
        </SimpleButton>
        <SimpleButton noShadow={true} onClick={handleGoToLoginClick}>
          Back
        </SimpleButton>
      </div>
    ),
    "reset-password-link-sent": null,
    "reset-password": (
      <div className={styles.passwordResetContainer}>
        <SimpleInput
          defaultVal={""}
          setDataChanged={setPassword}
          label="Enter new password"
          name="enter-new-password"
          type="password"
        ></SimpleInput>
        <SimpleInput
          defaultVal={""}
          setDataChanged={setConfirmPassword}
          label="Confrim password"
          name="confirm-password"
          type="password"
        ></SimpleInput>
        <SimpleButton
          noShadow={true}
          className={!passwordsEqual ? styles.unclickable : styles.actionButton}
          onClick={passwordsEqual ? handleResetPassword : null}
        >
          {resetButtonText}
        </SimpleButton>
      </div>
    ),
    "password-reset-success": (
      <SimpleButton
        className={styles.button}
        noShadow={true}
        onClick={handleGoToLoginClick}
      >
        Go to Login
      </SimpleButton>
    ),
  };

  return (
    <div className={styles.container}>
      <h1>{headers[props.page]}</h1>
      <div className={styles.subText}>{messages[props.page]}</div>
      {elements[props.page]}
    </div>
  );
};

export default Utility;
