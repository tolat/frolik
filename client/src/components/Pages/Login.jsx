import React, { useState } from "react";
import styles from "./styles/Login.module.scss";
import { useDispatch } from "react-redux";
import { login, checkAuth, logout } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Dispatch login action from redux context auth-actions
    await dispatch(login(username, password));

    setIsLoggingIn(false);
  };

  // If we are authenticated, navigate to /profile
  useEffect(()=>{
    if(isAuthenticated){
      navigate("/profile")
    }
  },[navigate, isAuthenticated])

  
  return (
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
  );
}

export default Login;

export const loginLoader = async () => {
  await checkAuth()()
  return null;
};
