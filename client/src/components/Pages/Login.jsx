import React, { useEffect, useState } from "react";
import styles from "./styles/Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import store from "../../store";
import { useNavigate } from "react-router-dom";
import SimpleInput from "../UI/SimpleInput";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await dispatch(fetchLogin(username, password));
    setIsLoggingIn(false);
  };

  // if authenticated, navigate to profile
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/profile");
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <div className={styles["login-page"]}>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <SimpleInput
            type="text"
            id="username"
            name="username"
            label="Username:"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <SimpleInput
            type="password"
            id="password"
            name="password"
            label="Password:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {!isLoggingIn && !authState.isAuthenticated
            ? "Login"
            : "Logging in..."}
        </button>
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
