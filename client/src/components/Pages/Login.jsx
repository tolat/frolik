import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Auth.module.scss";
import { useDispatch } from "react-redux";
import { fetchAuth, fetchLogin } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SimpleInput from "../UI/SimpleInput";
import CreateAccountModal from "../Modals/CreateAccountModal";
import SimpleButton from "../UI/SimpleButton";
import { modalActions } from "../../store/modal-slice";
import { popupActions } from "../../store/popup-slice";
import BrandLoader from "../UI/BrandLoader";
import biking from "../../images/_biking.png";
import hiking from "../../images/_hiking.png";
import playingball from "../../images/_playingball.png";
import music from "../../images/_music.png";
import tabletennis from "../../images/_tabletennis.png";
import logo from "../../images/frolik2.png";


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

  // Once authenticated, start on the Outing page (the home page) — unless
  // this tab was just refreshed on another page, then go back to it
  useEffect(() => {
    if (authState.isAuthenticated) {
      let returnTo = null;
      try {
        returnTo = sessionStorage.getItem("returnTo");
        sessionStorage.removeItem("returnTo");
      } catch {}
      const valid = ["/outing", "/profile", "/social", "/chat", "/alerts"];
      navigate(valid.includes(returnTo) ? returnTo : "/outing", { replace: true });
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

  const busy = isLoggingIn || authState.isAuthenticated;

  return (
    <div className={styles.page}>
      <CreateAccountModal />
      <img className={styles.logo} src={logo} alt="frolik" />
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to plan your next outing.</p>
        <div className={styles.fields}>
          <SimpleInput
            type="text"
            id="username"
            name="username"
            label="Email"
            ref={usernameRef}
            defaultVal={""}
            required
          />
          <SimpleInput
            type="password"
            id="password"
            name="password"
            label="Password"
            ref={passwordRef}
            defaultVal={""}
            required
          />
        </div>

        <SimpleButton
          noShadow={true}
          className={styles.primaryButton}
          type={"submit"}
        >
          {busy ? (
            <span className={styles.buttonContent}>
              <BrandLoader inline plain light noBalloon size={1.4} />
              Logging in…
            </span>
          ) : (
            "Log In"
          )}
        </SimpleButton>
        <SimpleButton
          noShadow={true}
          onClick={handleCreateAccountButtonClick}
          className={styles.secondaryButton}
        >
          Create Account
        </SimpleButton>
        <div className={styles.links}>
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className={styles.link}
          >
            Forgot password?
          </button>
          <button type="button" onClick={onSampleLogin} className={styles.link}>
            Sample login
          </button>
        </div>
      </form>
      <div className={styles.blurb}>
        <div>
          <img className={styles.blurbLogo} src={logo} alt="frolik" /> is a
          social app that gets people making new connections and getting out
          of the house!
        </div>
        <img
          className={styles.flavourImage}
          alt=""
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
