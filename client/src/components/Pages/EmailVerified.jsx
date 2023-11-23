import { useNavigate } from "react-router-dom";
import styles from "./styles/EmailVerified.module.scss";
import SimpleButton from "../UI/SimpleButton";

function EmailVerified() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <h1>Email Address Verified!</h1>
      <div className={styles.subText}>
        Your email address has been verified. You may now login with your
        username and password.
      </div>
      <SimpleButton
        className={styles.button}
        noShadow={true}
        onClick={handleButtonClick}
      >
        Go to Login
      </SimpleButton>
    </div>
  );
}

export default EmailVerified;
