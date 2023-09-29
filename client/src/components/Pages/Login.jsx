import React, { useState } from "react";
import styles from "./styles/Login.module.scss";
import useHttp from "../../hooks/use-http";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, sendRequest } = useHttp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked!");

    const handleResponse = (data) => {
      console.log(data);
    };

    sendRequest(
      {
        url: "http://localhost:3001/login",
        method: "POST",
        body: JSON.stringify({ username, password }),
        mode: "no-cors"
      },
      handleResponse
    );
  };

  return (
    <div className={styles['login-page']}>
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
      </form>
    </div>
  );
}

export default Login;
