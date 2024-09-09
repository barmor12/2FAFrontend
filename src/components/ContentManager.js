import React, { useState } from "react";
import axios from "axios";

const ContentManager = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSaveContent = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "/api/content",
      { title, body },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Content saved successfully");
  };

  return (
    <div>
      <h2>Create New Content</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Content Body"
      />
      <button onClick={handleSaveContent}>Save</button>
    </div>
  );
};

export default ContentManager;
