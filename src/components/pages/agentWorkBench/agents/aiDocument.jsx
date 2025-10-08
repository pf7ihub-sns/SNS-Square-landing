import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Document state
  const [file, setFile] = useState(null);
  const [docContent, setDocContent] = useState("");
  const [filename, setFilename] = useState("");

  // Handle chat submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const newMsg = { sender: "user", text: chatInput };
    setChatHistory((prev) => [...prev, newMsg]);

    try {
      const res = await axios.post(
        "http://localhost:8000/document/chat_with_report",
        new URLSearchParams({ query: chatInput })
      );
      const aiMsg = { sender: "ai", text: res.data.response };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    }
    setChatInput("");
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setFilename(uploadedFile.name);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const res = await axios.post("http://localhost:8000/document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocContent(res.data.summary || "");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle document content change
  const handleDocChange = (e) => {
    setDocContent(e.target.value);
  };

  // Save edited document
  const saveEditedDoc = async () => {
    if (!filename) return;

    try {
      await axios.post(
        "http://localhost:8000/document/save_edited_doc",
        new URLSearchParams({
          filename,
          updated_content: docContent,
          auto_export: true,
          export_format: "word",
        })
      );
      alert("Document saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving document");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Left: Chat */}
      <div
        style={{
          width: "40%",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor: msg.sender === "user" ? "#4caf50" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form
          style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}
          onSubmit={handleChatSubmit}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything..."
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              marginLeft: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>

      {/* Right: Document Upload & Edit */}
      <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <input type="file" onChange={handleFileUpload} />
          {filename && <span style={{ marginLeft: "10px" }}>{filename}</span>}
          <button
            onClick={saveEditedDoc}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
        <textarea
          value={docContent}
          onChange={handleDocChange}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            resize: "none",
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        />
      </div>
    </div>
  );
};

export default App;