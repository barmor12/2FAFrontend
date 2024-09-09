import React, { useState } from "react";
import axios from "axios";

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState("");

  const handleSetup2FA = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "/api/auth/2fa/setup",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setQrCode(res.data.qrCode);
  };

  return (
    <div>
      <h2>Setup 2FA</h2>
      <button onClick={handleSetup2FA}>Enable 2FA</button>
      {qrCode && (
        <div>
          <p>Scan this QR code with your 2FA app:</p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default Setup2FA;
