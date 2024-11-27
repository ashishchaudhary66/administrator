import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Registration.css";

function Registration(props) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [dob,setDob] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error, setError]=useState('');
  const setIsAuthenticated = props.setIsAuthenticated;

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();

  const registerUser = async () => {
    setError("");
    try {
      if(confirmPassword!==password){
        setError("Password mismatch");
        return;
      }
      const url = `${BASE_URL}/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, dob, password }),
      });

      if (!response.ok) {
        const errorMessage = (await response.json()).message || "Signup failed.";
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

  const handleSubmit = (e) =>{
    e.preventDefault();
    registerUser();
  }
  return (
    <div className="signin">
      <h3>SIGN UP</h3>
      <form className="form" onSubmit={handleSubmit}>
        <label className="input-container">
          <span>Name</span>
          <input
            className="input-type"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </label>
        <label className="input-container">
          <span>Email</span>
          <input
            className="input-type"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </label>
        <label className="input-container">
          <span>DOB</span>
          <input
            className="input-type"
            type="date"
            value={dob}
            onChange={(e)=>setDob(e.target.value)}
            required
          />
        </label>
        <label className="input-container">
          <span>Password</span>
          <input
            className="input-type"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </label>
        <label className="input-container">
          <span>Confirm Password</span>
          <input
            className="input-type"
            type="password"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit"> Register </button>
        <div className="user-login">
          <div className="remember-me">
            <span>Already Registered? </span>
          </div>
          <div>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Registration;