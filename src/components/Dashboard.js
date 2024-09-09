import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState(""); // טוקן 2FA
  const [loading, setLoading] = useState(true); // מצב טעינה
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // אין טוקן, מחזיר לדף ההתחברות
          return;
        }

        const res = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
        setIs2FAEnabled(res.data.twoFactorEnabled); // בדיקה אם ה-2FA מופעל
        setLoading(false); // כיבוי מצב הטעינה לאחר קבלת הנתונים
      } catch (err) {
        console.error(err);
        navigate("/"); // יש בעיה עם הטוקן או החיבור, מחזיר לדף ההתחברות
      }
    };

    fetchData();
  }, [navigate]);

  // פונקציית התנתקות
  const handleLogout = () => {
    localStorage.removeItem("token"); // מחיקת הטוקן מה-localStorage
    navigate("/"); // הפניה חזרה לדף ההתחברות
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
      setQrCode(res.data.qrCode); // הצגת קוד QR לסריקה
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
      setIs2FAEnabled(false); // עדכון סטטוס 2FA
      setQrCode(""); // הסרת ה-QR
    } catch (err) {
      console.error("Failed to disable 2FA", err);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/auth/2fa/verify",
        { userId: userData._id, token: twoFAToken }, // שליחת טוקן ה-2FA שהוזן
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.verified) {
        alert("2FA verified successfully!");
        setIs2FAEnabled(true);
        setQrCode(""); // הסרת קוד ה-QR לאחר אימות מוצלח
      } else {
        alert("Invalid 2FA token.");
      }
    } catch (err) {
      console.error("Failed to verify 2FA", err);
      alert("2FA verification failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // מצב טעינה עד שהנתונים יגיעו
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
