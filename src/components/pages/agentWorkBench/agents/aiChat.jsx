import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, Upload, Send, Bot, User, FileText, X } from "lucide-react";

// Optional: Install and import marked for markdown parsing
// import { marked } from "marked";

const API_BASE = "http://127.0.0.1:8000";
const personas = ["neutral", "formal", "casual", "technical", "simplified", "friendly"];

const AiChat = () => {
  const [persona, setPersona] = useState("technical");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/ai-chat/reset`, { method: "POST" }).catch((err) => {
      console.log("Reset failed:", err);
    });
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

const formatResponse = (data) => {
  if (!data) return "No response";
  if (data.response) {
    // Parse markdown-like bold syntax (**text**)
    let formatted = data.response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Split the response into lines and remove empty ones
    const lines = formatted.split("\n").filter((line) => line.trim());

    // Check for numbered list (e.g., "5. text")
    const isNumberedList = lines.some((line) => /^\d+\.\s/.test(line.trim()));

    // Check for bullet list (e.g., "* text")
    const isBulletList = lines.some((line) => /^\*\s/.test(line.trim()));

    if (isNumberedList) {
      // Format as an ordered list
      let listContent = "<ol class='list-decimal pl-6 space-y-2'>";
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (/^\d+\.\s/.test(trimmedLine)) {
          const content = trimmedLine.replace(/^\d+\.\s/, "");
          listContent += `<li>${content}</li>`;
        } else {
          listContent += `</ol><p>${trimmedLine}</p><ol class='list-decimal pl-6 space-y-2'>`;
        }
      });
      listContent += "</ol>";
      listContent = listContent.replace(/<ol class='list-decimal pl-6 space-y-2'><\/ol>/g, "");
      return <div dangerouslySetInnerHTML={{ __html: listContent }} />;
    } else if (isBulletList) {
      // Format as an unordered list
      let listContent = "<ul class='list-disc pl-6 space-y-2'>";
      let inList = false;
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (/^\*\s/.test(trimmedLine)) {
          if (!inList) {
            inList = true;
          }
          const content = trimmedLine.replace(/^\*\s/, "");
          listContent += `<li>${content}</li>`;
        } else {
          if (inList) {
            listContent += "</ul>";
            inList = false;
          }
          listContent += `<p>${trimmedLine}</p>`;
        }
      });
      if (inList) {
        listContent += "</ul>";
      }
      return <div dangerouslySetInnerHTML={{ __html: listContent }} />;
    }

    // Non-list response, just return the formatted text
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  }

  if (data.analytics || data.experience || data.match) {
    return (
      <div className="space-y-2">
        {data.analytics && (
          <p>
            <strong className="text-blue-900">📊 Analytics:</strong> {data.analytics}
          </p>
        )}
        {data.experience && (
          <p>
            <strong className="text-blue-900">💼 Experience:</strong> {data.experience}
          </p>
        )}
        {data.match && (
          <p>
            <strong className="text-blue-900">✅ Match:</strong> {data.match}
          </p>
        )}
      </div>
    );
  }

  return <pre className="text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>;
};

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/ai-chat/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "File upload failed");
      }

      const data = await response.json();
      setFileId(data.file_id);
      setUploadedFileName(file.name);
      setChatHistory((prev) => [
        ...prev,
        { role: "system", content: `File uploaded: ${file.name}` },
      ]);
    } catch (err) {
      setError(err.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);

    const userMessage = message.trim();
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");

    try {
      const endpoint = chatHistory.length > 0 ? "/chat-follow" : "/chat";

      const response = await fetch(`${API_BASE}/ai-chat${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          persona,
          file_id: fileId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Chat failed");
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: formatResponse(data) },
      ]);
    } catch (err) {
      setError(err.message || "Chat failed");
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFileId(null);
    setUploadedFileName(null);
  };

  const handleNewChat = async () => {
    try {
      await fetch(`${API_BASE}/ai-chat/reset`, { method: "POST" });
      setChatHistory([]);
      setMessage("");
      setFileId(null);
      setUploadedFileName(null);
      setError(null);
    } catch (err) {
      console.log("Reset failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: "75vh" }}>
        <div className="p-6 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
                <p className="text-blue-200 text-sm">Powered by advanced AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Persona:</span>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {personas.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg cursor-pointer hover:bg-blue-800 transition-colors text-sm font-medium">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload File"}
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {chatHistory.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium ml-auto"
            >
              <X className="w-4 h-4" />
              New Chat
            </button>
          )}

          {uploadedFileName && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-green-800">{uploadedFileName}</span>
              <button
                onClick={clearFile}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-500 max-w-md">
                Ask me anything! Upload a file or just start typing your question.
              </p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-blue-700 text-white"
                    : msg.role === "system"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-5 h-5" />
                ) : msg.role === "system" ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>

              <div
                className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  msg.role === "assistant"
                    ? "bg-blue-50 border border-blue-100"
                    : msg.role === "system"
                    ? "bg-yellow-50 border border-yellow-200 text-sm italic"
                    : "bg-gray-700 text-white"
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {typeof msg.content === "string" ? msg.content : msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && (
          <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your message... (Shift + Enter for new line)"
                rows="1"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className={`p-3 rounded-xl text-white transition-all flex items-center justify-center ${
                loading || !message.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 hover:shadow-lg"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;