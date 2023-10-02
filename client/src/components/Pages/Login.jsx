import React, { useEffect, useState } from "react";
import styles from "./styles/Login.module.scss";
import { useDispatch } from "react-redux";
import { fetchLogin, fetchAuth } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import MainContainer from "../UI/MainContainer";
import { redirect } from "react-router-dom";
import store from "../../store";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await dispatch(fetchLogin(username, password));
    setIsLoggingIn(false);
  };

  // if authenticated, navigate to profile
  useEffect(()=>{
    if(authState.isAuthenticated){
      navigate("/profile")
    }
  },[authState.isAuthenticated, navigate])

  return (
    <MainContainer>
      <div className={styles["login-page"]}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {isLoggingIn && <div>Logging in...</div>}
        </form>
      </div>
    </MainContainer>
  );
}

export default Login;

export const loginLoader = async () => {
  await fetchAuth()();

  if (store.getState().auth.isAuthenticated) {
    return redirect("/profile");
  }
  return null;
};
