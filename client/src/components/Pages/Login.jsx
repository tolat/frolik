import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import store from "../../store";
import { useNavigate } from "react-router-dom";
import SimpleInput from "../UI/SimpleInput";
import CreateAccountModal from "../Modals/CreateAccountModal";
import SimpleButton from "../UI/SimpleButton";
import { modalActions } from "../../store/modal-slice";
import { authActions } from "../../store/auth-slice";
import { initializeUserPhotos } from "../../store/data-actions";
import { fetchChats, fetchGobals } from "../../utils/data-fetch";

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  // If authenticated, navigate to profile
  useEffect(() => {
    fetchGobals();
    if (authState.isAuthenticated) {
      navigate("/profile");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    fetchLogin(
      usernameRef.current.value,
      passwordRef.current.value,
      setIsLoggingIn
    );
  };

  // Handle create account button click
  const handleCreateAccountButtonClick = (e) => {
    e.preventDefault();
    dispatch(modalActions.setSelector("create-account"));
    dispatch(modalActions.showModal());
  };

  return (
    <div className={styles["login-page"]}>
      <CreateAccountModal />
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <h2>Login</h2>
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

        <SimpleButton className={styles.loginButton} type={"submit"}>
          {!isLoggingIn && !authState.isAuthenticated
            ? "Login"
            : "Logging in..."}
        </SimpleButton>
        <SimpleButton
          onClick={handleCreateAccountButtonClick}
          className={styles.createAccountButton}
        >
          Create Account
        </SimpleButton>
      </form>
    </div>
  );
}

export default Login;

export const loginLoader = async () => {
  if (store.getState().auth.isAuthenticated) {
    return redirect("/profile");
  }

  return null;
};
