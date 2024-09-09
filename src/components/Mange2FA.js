import React, { useState } from "react";
import axios from "axios";

const Manage2FA = () => {
  const [enabled, setEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const handleSetup2FA = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "/api/auth/2fa/setup",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setQrCode(res.data.otpauth_url);
    setEnabled(true);
  };

  const handleDisable2FA = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "/api/auth/2fa/disable",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEnabled(false);
    setQrCode("");
  };

  return (
    <div>
      <h2>Manage 2FA</h2>
      {!enabled ? (
        <button onClick={handleSetup2FA}>Enable 2FA</button>
      ) : (
        <button onClick={handleDisable2FA}>Disable 2FA</button>
      )}
      {qrCode && (
        <div>
          <p>Scan this QR code with your 2FA app:</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`}
            alt="QR Code"
          />
        </div>
      )}
    </div>
  );
};

export default Manage2FA;
