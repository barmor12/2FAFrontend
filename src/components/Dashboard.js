import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // אם אין טוקן, מחזיר לדף ההתחברות
          return;
        }

        const res = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
        setProfileImage(res.data.profileImage);
      } catch (err) {
        console.error(err);
        navigate("/"); // אם יש בעיה עם הטוקן, מחזיר לדף ההתחברות
      }
    };

    fetchData();
  }, [navigate]);

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/user",
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password updated successfully");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  const handle2FAToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/auth/2fa/${userData.twoFactorEnabled ? "disable" : "setup"}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(
        `2FA ${userData.twoFactorEnabled ? "disabled" : "enabled"} successfully`
      );
      window.location.reload(); // טען מחדש את הדף כדי לעדכן את המצב
    } catch (err) {
      console.error(err);
      alert("Failed to toggle 2FA");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProfileImageUpload = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      const res = await axios.post("/api/auth/upload-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileImage(res.data.profileImageUrl); // עדכן את התמונה בפרופיל עם הקישור החדש
      alert("Profile image updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile image");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {userData.email}</h1>
        <div className="profile-section">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-placeholder">Upload Image</div>
          )}
          <input type="file" onChange={handleFileChange} />
          <button
            className="dashboard-button"
            onClick={handleProfileImageUpload}
          >
            Upload
          </button>
        </div>
        <button className="dashboard-button" onClick={handle2FAToggle}>
          {userData.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </button>
      </div>
      <div className="dashboard-content">
        <div>
          <h2>Change Password</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="auth-input"
          />
          <button onClick={handlePasswordChange} className="dashboard-button">
            Change Password
          </button>
        </div>
        <Link to="/setup-2fa" className="dashboard-link">
          {userData.twoFactorEnabled ? "Manage 2FA" : "Setup 2FA"}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
