import React, { useState } from "react";
import "../styles/LoginPage.scss";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked!");

    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      if (response.status === 200) {
        ///Login successful
        const { token } = response.data;

        //Store the token in local storage
        localStorage.setItem("token", token);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      // Handle login error (e.g., incorrect credentials, server error)
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="login-page">
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

export default LoginPage;
