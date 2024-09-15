import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password field
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z]).{7,}$/; // At least 7 characters, and one uppercase letter
    return passwordRegex.test(password);
  };

  // Handle registration
  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 7 characters and contain at least one uppercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    try {
      await axios.post("/api/auth/register", { email, password });
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="auth-input"
        />
        {emailError && <p className="error-message">{emailError}</p>}{" "}
        {/* Email error message */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}{" "}
        {/* Password error message */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="auth-input"
        />
        {passwordMatchError && (
          <p className="error-message">{passwordMatchError}</p>
        )}{" "}
        {/* Password match error message */}
        <p>
          Password must be at least 7 characters long and contain at least one
          uppercase letter.
        </p>
        <button onClick={handleRegister} className="auth-button">
          Register
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
