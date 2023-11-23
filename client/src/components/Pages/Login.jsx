import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchAuth, fetchLogin } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SimpleInput from "../UI/SimpleInput";
import CreateAccountModal from "../Modals/CreateAccountModal";
import SimpleButton from "../UI/SimpleButton";
import { modalActions } from "../../store/modal-slice";
import { popupActions } from "../../store/popup-slice";

const validPreviousPaths = ["/go", "/profile", "/social", "/chat"];

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  // If authenticated, navigate to profile
  useEffect(() => {
    if (authState.isAuthenticated) {
      const prevUrl = localStorage.getItem("previousUrl");
      navigate((validPreviousPaths.includes(prevUrl) && prevUrl) || "/profile");
    } else {
      localStorage.setItem("previousUrl", "/login");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const onComplete = (response) => {
      setIsLoggingIn(false);
      if (response.status === 401) {
        dispatch(
          popupActions.setWarningHeader("Incorrect Username or Password")
        );
        dispatch(popupActions.setWarningMessage("Try again."));
        dispatch(popupActions.showPopup("generic-warning"));
      }
    };

    fetchLogin(
      usernameRef.current.value,
      passwordRef.current.value,
      onComplete
    );
  };

  // Handle create account button click
  const handleCreateAccountButtonClick = (e) => {
    e.preventDefault();
    dispatch(modalActions.setSelector("create-account"));
    dispatch(modalActions.showModal());
  };

  const onForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/send-reset-password-link");
  };

  return (
    <div className={styles["login-page"]}>
      <CreateAccountModal />
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <h1 className={styles.header}>Login</h1>
        <div>
          <SimpleInput
            type="text"
            id="username"
            name="username"
            label="Username:"
            ref={usernameRef}
            defaultVal={""}
            required
          />
        </div>
        <div>
          <SimpleInput
            type="password"
            id="password"
            name="password"
            label="Password:"
            ref={passwordRef}
            defaultVal={""}
            required
          />
        </div>
        <div className={styles.smallButtons}>
          <button
            onClick={onForgotPasswordClick}
            className={styles.forgotButton}
          >
            Forgot Password
          </button>
        </div>

        <SimpleButton
          noShadow={true}
          className={styles.loginButton}
          type={"submit"}
        >
          {!isLoggingIn && !authState.isAuthenticated
            ? "Login"
            : "Logging in..."}
        </SimpleButton>
        <SimpleButton
          noShadow={true}
          onClick={handleCreateAccountButtonClick}
          className={styles.createAccountButton}
        >
          Create Profile
        </SimpleButton>
      </form>
    </div>
  );
}

export default Login;

export const loginLoader = async () => {
  await fetchAuth();
  return null;
};
