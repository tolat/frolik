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
import LoaderSpinner from "../UI/LoaderSpinner";
import biking from "../../images/_biking.png";
import hiking from "../../images/_hiking.png";
import playingball from "../../images/_playingball.png";
import music from "../../images/_music.png";
import tabletennis from "../../images/_tabletennis.png";
import logo from "../../images/frolik2.png";

const validPreviousPaths = ["/outing", "/profile", "/social", "/chat"];

const flavourImages = [biking, hiking, playingball, music, tabletennis];

const flavourIndex = Math.abs(
  ((Math.random() * 100) % flavourImages.length).toFixed(0) - 1
);

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
      usernameRef.current.value.toLowerCase(),
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

  const onSampleLogin = (e) => {
    usernameRef.current.value = "app.frolik@gmail.com";
    passwordRef.current.value = "frolik1*";
    handleSubmit(e);
  };

  return (
    <div className={styles["login-page"]}>
      <CreateAccountModal />
      <div className={styles.formContainer}>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <h1 className={styles.header}>Login</h1>
          <div>
            <SimpleInput
              type="text"
              id="username"
              name="username"
              label="Email:"
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

          <SimpleButton
            noShadow={true}
            className={styles.loginButton}
            type={"submit"}
          >
            {!isLoggingIn && !authState.isAuthenticated ? (
              "Login"
            ) : (
              <div className={styles.loaderContainer}>
                Loggin In &nbsp;{" "}
                <LoaderSpinner width="1.5rem" height="1.5rem" />
              </div>
            )}
          </SimpleButton>
          <SimpleButton
            noShadow={true}
            onClick={handleCreateAccountButtonClick}
            className={styles.createAccountButton}
          >
            Create Profile
          </SimpleButton>
          <div className={styles.smallButtons}>
            <button
              onClick={onForgotPasswordClick}
              className={styles.forgotButton}
            >
              Forgot Password
            </button>
            <button onClick={onSampleLogin} className={styles.forgotButton}>
              Sample Login
            </button>
          </div>
        </form>
      </div>
      <div className={styles.flavourContainer}>
        <div className={styles.appBlurb}>
          <img className={styles.logo} src={logo} alt="logo" /> is a social
          media platform designed to engage people to make new connections and
          get out of the house!
        </div>
        <img
          className={styles.flavourImage}
          alt="froliking"
          src={flavourImages[flavourIndex]}
        />
      </div>
    </div>
  );
}

export default Login;

export const loginLoader = async () => {
  await fetchAuth();
  return null;
};
