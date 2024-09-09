import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  // תהליך ההתחברות
  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.requires2FA) {
        setRequires2FA(true);
        setQrCode(res.data.qrCode);
        setUserId(res.data.userId);
      } else {
        // שמירת הטוקן
        localStorage.setItem("token", res.data.token);
        console.log("Token saved: ", res.data.token); // בדיקת שמירת הטוקן
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.response.data.msg);
    }
  };

  // תהליך אימות 2FA
  const handleVerify2FA = async () => {
    try {
      const res = await axios.post("/api/auth/2fa/verify", { userId, token });
      if (res.data.verified) {
        localStorage.setItem("token", res.data.token);
        console.log("2FA Token verified, navigating to dashboard...");
        navigate("/dashboard");
      } else {
        alert("Invalid 2FA token");
      }
    } catch (err) {
      console.error(err);
      alert("2FA verification failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {!requires2FA ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="auth-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="auth-input"
            />
            <button onClick={handleLogin} className="auth-button">
              Login
            </button>
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </>
        ) : (
          <>
            {qrCode && (
              <div>
                <p>Scan this QR code with your 2FA app:</p>
                <img src={qrCode} alt="QR Code" />
              </div>
            )}
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 2FA Token"
              className="auth-input"
            />
            <button onClick={handleVerify2FA} className="auth-button">
              Verify 2FA
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
