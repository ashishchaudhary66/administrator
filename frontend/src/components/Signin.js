import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";

function Signin({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  const loginUser = async () => {
    setError("");
    try {
      const url = `${BASE_URL}/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = (await response.json()).message || "Login failed.";
        setError(errorMessage);
        return;
      }

      const responseData = await response.json();
      sessionStorage.setItem("token", responseData.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser();
  };

  return (
    <div className="signin">
      <h3>SIGN IN</h3>
      <form className="form" onSubmit={handleSubmit} aria-label="Sign in form">
        <label className="email-container">
          <PersonIcon />
          <input
            className="input-type"
            type="email"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="password-container">
          <LockIcon />
          <input
            className="password-type"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="user-login-info">
          <label>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <div>
            <Link to="/registration">Forgot your password?</Link>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit">LOGIN</button>
        <div className="user-login">
          <span>New User?</span>
          <Link to="/registration">Create User</Link>
        </div>
      </form>
    </div>
  );
}

export default Signin;
