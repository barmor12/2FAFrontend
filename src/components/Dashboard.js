import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState(""); // 2FA token
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // No token, redirect to login page
          return;
        }

        const res = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
        setIs2FAEnabled(res.data.twoFactorEnabled); // Update 2FA status based on server response
        setLoading(false); // Turn off loading after data is received
      } catch (err) {
        console.error(err);
        navigate("/"); // If there's an issue with token or connection, redirect to login
      }
    };

    fetchData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  };

  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/2fa/setup",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQrCode(res.data.qrCode); // Show QR code for scanning
    } catch (err) {
      console.error("Failed to enable 2FA", err);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/auth/2fa/disable",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIs2FAEnabled(false); // Update 2FA status
      setQrCode(""); // Clear QR code
    } catch (err) {
      console.error("Failed to disable 2FA", err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/2fa/verify",
        { userId: userData._id, token: twoFAToken }, // Send entered 2FA token for verification
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.verified) {
        alert("2FA verified successfully!");
        setIs2FAEnabled(true); // Mark 2FA as enabled after successful verification
        setQrCode(""); // Clear QR code after successful verification
      } else {
        alert("Invalid 2FA token.");
      }
    } catch (err) {
      console.error("Failed to verify 2FA", err);
      alert("2FA verification failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  return (
    <div>
      <h1>Welcome, {userData.email}</h1>
      <div>
        {is2FAEnabled ? (
          <>
            <p>2FA is enabled</p>
            <button onClick={handleDisable2FA}>Disable 2FA</button>
          </>
        ) : (
          <>
            <p>2FA is disabled</p>
            <button onClick={handleEnable2FA}>Enable 2FA</button>
            {qrCode && (
              <div>
                <p>Scan this QR code with your 2FA app:</p>
                <img src={qrCode} alt="QR Code" />
                <input
                  type="text"
                  value={twoFAToken}
                  onChange={(e) => setTwoFAToken(e.target.value)}
                  placeholder="Enter 2FA Token"
                />
                <button onClick={handleVerify2FA}>Verify 2FA</button>
              </div>
            )}
          </>
        )}
      </div>
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
