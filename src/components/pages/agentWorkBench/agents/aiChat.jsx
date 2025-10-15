import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, Upload, Send, Bot, User, FileText, X, Globe, ExternalLink, Plus, Menu, MessageSquare, MoreVertical, SquareChevronLeft } from "lucide-react";
import FileUploadDropdown from './AI_Docs/utils/FileUploadDropdown';
import OneDriveModal from './AI_Docs/utils/OneDriveModal';
import { CloudStorageService } from './AI_Docs/utils/CloudStorageService';
import backgroundImage from '../../../../../public/images/ai_chat.png';

const API_BASE = "http://127.0.0.1:8000";
const personas = ["neutral", "formal", "casual", "technical", "simplified", "friendly"];

const AiChat = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState("technical");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationsList, setConversationsList] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(null);
  const [oneDriveModalOpen, setOneDriveModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Rename Modal States
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId && !event.target.closest('.conversation-menu')) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  // Focus input when rename modal opens
  useEffect(() => {
    if (renameModalOpen && renameInputRef.current) {
      setTimeout(() => {
        renameInputRef.current.focus();
        renameInputRef.current.select();
      }, 100);
    }
  }, [renameModalOpen]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE}/ai-chat/conversations`);
      if (response.ok) {
        const data = await response.json();
        setConversationsList(data.conversations || []);
      }
    } catch (err) {
      console.log("Failed to fetch conversations:", err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE}/ai-chat/conversation/${conversationId}`);
      if (!response.ok) throw new Error("Failed to load conversation");
      const data = await response.json();
      const formattedMessages = (data.messages || []).map(msg => ({
        role: msg.role === "agent" ? "assistant" : (msg.role || "user"),
        content: msg.content,
        sources: msg.sources || [],
        searchEnabled: msg.searchEnabled || msg.search_enabled || false
      }));

      setCurrentConversationId(conversationId);
      setChatHistory(formattedMessages);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      setError("Failed to load conversation");
    }
  };

  const processResponseForStorage = (response) => {
    if (!response) return null;

    const formatted = response
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

    const lines = formatted.split("<br/>").filter((line) => line.trim());
    const isNumberedList = lines.some((line) => /^\d+\.\s/.test(line.trim()));
    const isBulletList = lines.some((line) => /^[\*\-]\s/.test(line.trim()));

    return {
      html: formatted,
      indentation: {
        type: isNumberedList ? 'numbered' : (isBulletList ? 'bullet' : 'paragraph'),
        lines: lines.map(line => ({
          text: line,
          indent: (line.match(/^\s+/) || [""])[0].length
        }))
      }
    };
  };

  const formatNumberedList = (lines) => {
    let html = "<ol class='list-decimal pl-0 space-y-4 my-4'>";
    let currentIndent = 0;

    lines.forEach(({ text, indent }) => {
      const paddingLeft = indent * 24; // Consistent indentation
      while (indent > currentIndent) {
        html += "<ol class='list-decimal pl-6 space-y-4 mt-2'>";
        currentIndent++;
      }
      while (indent < currentIndent) {
        html += "</ol>";
        currentIndent--;
      }
      html += `<li class='pl-2 leading-relaxed flex items-start' style='margin-left: ${paddingLeft}px'>
        <span class="mr-4 text-gray-600 font-medium"></span>
        <span>${text}</span>
      </li>`;
    });

    while (currentIndent > 0) {
      html += "</ol>";
      currentIndent--;
    }
    return html + "</ol>";
  };

  const formatBulletList = (lines) => {
    let html = "<ul class='list-none pl-0 space-y-4 my-4'>";
    let currentIndent = 0;

    lines.forEach(({ text, indent }) => {
      const bulletClass = currentIndent === 0 ? 'list-disc' : 'list-circle';
      const paddingLeft = indent * 24; // Consistent indentation
      while (indent > currentIndent) {
        html += `<ul class='${bulletClass} pl-6 space-y-4 mt-2'>`;
        currentIndent++;
      }
      while (indent < currentIndent) {
        html += "</ul>";
        currentIndent--;
      }
      html += `<li class='pl-2 leading-relaxed flex items-start' style='margin-left: ${paddingLeft}px'>
        <span class="mr-2">•</span>
        <span>${text}</span>
      </li>`;
    });

    while (currentIndent > 0) {
      html += "</ul>";
      currentIndent--;
    }
    return html + "</ul>";
  };

  const formatParagraphs = (lines) => {
    return lines
      .map(({ text, indent }) => {
        const marginLeft = indent * 24;
        return `<p class='my-4 leading-relaxed text-gray-700' style='margin-left: ${marginLeft}px'>${text}</p>`;
      })
      .join("\n");
  };

  const formatResponse = (data) => {
    if (!data) return "No response";

    if (data.isFormatted && data.formattedContent) {
      const { html, indentation } = data.formattedContent;

      if (indentation.type === 'numbered') {
        return <div className="formatted-response" dangerouslySetInnerHTML={{ __html: formatNumberedList(indentation.lines) }} />;
      } else if (indentation.type === 'bullet') {
        return <div className="formatted-response" dangerouslySetInnerHTML={{ __html: formatBulletList(indentation.lines) }} />;
      } else {
        return <div className="formatted-response px-4" dangerouslySetInnerHTML={{ __html: formatParagraphs(indentation.lines) }} />;
      }
    }

    if (data.response) {
      let formatted = data.response
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br/>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

      const lines = formatted.split("<br/>").filter((line) => line.trim());
      const isNumberedList = lines.some((line) => /^\d+\.\s/.test(line.trim()));
      const isBulletList = lines.some((line) => /^[\*\-]\s/.test(line.trim()));

      if (isNumberedList) {
        let listContent = "<ol class='list-decimal pl-8 space-y-4 my-4'>";
        let previousLevel = 0;
        lines.forEach((line) => {
          const trimmedLine = line.trim();
          const indentLevel = (line.match(/^\s+/) || [""])[0].length;

          if (/^\d+\.\s/.test(trimmedLine)) {
            if (indentLevel > previousLevel) {
              listContent += "<ol class='list-decimal pl-8 space-y-4 mt-2'>";
            } else if (indentLevel < previousLevel) {
              listContent += "</ol>";
            }
            const content = trimmedLine.replace(/^\d+\.\s/, "");
            listContent += `<li class='pl-2 leading-relaxed'>${content}</li>`;
            previousLevel = indentLevel;
          } else if (trimmedLine) {
            while (previousLevel > 0) {
              listContent += "</ol>";
              previousLevel--;
            }
            listContent += `</ol><p class='my-4 leading-relaxed'>${trimmedLine}</p><ol class='list-decimal pl-8 space-y-4 my-4'>`;
          }
        });
        while (previousLevel > 0) {
          listContent += "</ol>";
          previousLevel--;
        }
        listContent += "</ol>";
        listContent = listContent.replace(/<ol class='list-decimal pl-8 space-y-4 my-4'><\/ol>/g, "");
        return <div className="formatted-response" dangerouslySetInnerHTML={{ __html: listContent }} />;
      } else if (isBulletList) {
        let listContent = "<ul class='list-disc pl-8 space-y-4 my-4'>";
        let inList = false;
        let previousLevel = 0;

        lines.forEach((line) => {
          const trimmedLine = line.trim();
          const indentLevel = (line.match(/^\s+/) || [""])[0].length;

          if (/^[\*\-]\s/.test(trimmedLine)) {
            if (!inList) {
              inList = true;
            } else if (indentLevel > previousLevel) {
              listContent += "<ul class='list-disc pl-8 space-y-4 mt-2'>";
            } else if (indentLevel < previousLevel) {
              listContent += "</ul>";
            }
            const content = trimmedLine.replace(/^[\*\-]\s/, "");
            listContent += `<li class='pl-2 leading-relaxed'>${content}</li>`;
            previousLevel = indentLevel;
          } else if (trimmedLine) {
            while (previousLevel > 0) {
              listContent += "</ul>";
              previousLevel--;
            }
            if (inList) {
              listContent += "</ul>";
              inList = false;
            }
            listContent += `<p class='my-4 leading-relaxed text-gray-700'>${trimmedLine}</p>`;
          }
        });
        while (previousLevel > 0) {
          listContent += "</ul>";
          previousLevel--;
        }
        if (inList) {
          listContent += "</ul>";
        }
        return <div className="formatted-response" dangerouslySetInnerHTML={{ __html: listContent }} />;
      }

      const paragraphs = formatted.split("<br/><br/>").filter(p => p.trim());
      formatted = paragraphs
        .map(p => `<p class='my-4 leading-relaxed text-gray-700'>${p.replace(/<br\/>/g, "</p><p class='my-4 leading-relaxed text-gray-700'>")}</p>`)
        .join("");

      return <div className="formatted-response px-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
    }
    return data.toString();
  };

  const uploadFileToServer = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const resp = await fetch(`${API_BASE}/ai-chat/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await resp.json();
      setFileId(data.file_id);
      setUploadedFileName(file.name);
      setUploadedFile({ name: file.name, size: file.size, type: file.type });
      setChatHistory((prev) => [...prev, { role: 'system', content: `File uploaded: ${file.name}` }]);
      return data;
    } catch (err) {
      setError(err.message || 'Upload failed');
      throw err;
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
      const endpoint = "/chat";
      const requestBody = {
        query: userMessage,
        persona,
        file_id: fileId,
        web_search: webSearchEnabled
      };

      if (currentConversationId) {
        requestBody.chat_id = currentConversationId;
      }

      const response = await fetch(`${API_BASE}/ai-chat${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Chat failed");
      }

      const data = await response.json();

      if (!currentConversationId) {
        setCurrentConversationId(data.chat_id || data.session_id || null);
      }

      const rawText = data.response || '';
      const formattedMeta = processResponseForStorage(rawText);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: rawText,
          response: rawText,
          isFormatted: true,
          formattedContent: formattedMeta,
          sources: data.sources || [],
          searchEnabled: data.search_enabled || false,
        },
      ]);

      await fetchConversations();
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
    setUploadedFile(null);
  };

  const handleNewChat = async () => {
    try {
      setCurrentConversationId(null);
      setChatHistory([]);
      setMessage("");
      setFileId(null);
      setUploadedFileName(null);
      setError(null);
      setWebSearchEnabled(false);
    } catch (err) {
      setError("Failed to start new chat");
      console.error("New chat failed:", err);
    }
  };

  // Open rename modal
  const openRenameModal = (sessionId, currentTitle) => {
    setRenameConversationId(sessionId);
    setRenameValue(currentTitle);
    setRenameModalOpen(true);
    setActiveMenuId(null);
  };

  // Handle rename submit
  const handleRenameSubmit = async () => {
    if (!renameValue.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/ai-chat/${renameConversationId}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: renameValue.trim() }),
      });

      if (!response.ok) throw new Error("Failed to rename conversation");

      await fetchConversations();
      setRenameModalOpen(false);
      setRenameConversationId(null);
      setRenameValue("");
    } catch (err) {
      console.error("Rename failed:", err);
      setError("Failed to rename conversation");
    }
  };

  const handleDeleteConversation = async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE}/ai-chat/session/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      if (currentConversationId === sessionId) {
        setCurrentConversationId(null);
        setChatHistory([]);
      }

      await fetchConversations();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete conversation");
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg flex h-[calc(100vh-6rem)] mt-24 w-full overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white-50 flex flex-col transition-all duration-300 overflow-hidden h-full`}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 p-2 rounded-lg transition"
              >
                <SquareChevronLeft className="w-6 h-6 text-blue-600" />
              </button>
              <span className="font-semibold text-lg text-gray-800">AI Chat Bot</span>
            </div>

            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#064EE3] to-[#3D76EC] 
             text-white rounded-lg hover:from-[#3D76EC] hover:to-[#064EE3] 
             transition-all duration-300 shadow-md hover:shadow-lg 
             text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            <div className="text-xs font-semibold text-[#5F5F60] px-3 py-2">Chat History</div>
            <div className="space-y-1">
              {conversationsList.map((conv) => (
                <div key={conv.id} className="relative conversation-menu px-2 py-1">
                  <div className="flex items-center w-full group">
                    <button
                      onClick={() => loadConversation(conv.id)}
                      className={`flex-1 text-left px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${currentConversationId === conv.id ? "bg-gray-100" : ""
                        }`}
                    >
                      <span className="truncate">{conv.title}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === conv.id ? null : conv.id);
                      }}
                      aria-label="Open conversation menu"
                      className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {activeMenuId === conv.id && (
                    <div className="absolute right-2 top-8  bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 min-w-[140px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRenameModal(conv.id, conv.title);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-base text-blue-600 font-medium"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this conversation?')) {
                            handleDeleteConversation(conv.id);
                          }
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-base text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full min-w-0 border-1 border-[#B6B9BE] rounded-xl shadow-xl mt-1 overflow-hidden">
          {/* Header */}
          <div className="rounded-lg p-2 flex items-center gap-4 mt-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Chat Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 min-h-0 relative"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: '60%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="w-full h-full">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-0">
                  <div className="mb-5">
                    <span className="px-4 py-2 text-[#155DFC] text-sm font-semibold rounded-full border border-[#155DFC]">
                      AI Chat Bot
                    </span>
                  </div>

                  <h2 className="text-5xl font-bold text-gray-900 mb-2 leading-tight">
                    Start a New Chat
                  </h2>

                  <p className="text-gray-600 text-base max-w-lg">
                    Ask me anything! I'm here to help.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((msg, i) => (
                    <div key={i}>
                      <div className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant"
                            ? "bg-[#155DFC] text-white"
                            : msg.role === "system"
                              ? "bg-[#1357E5] text-white"
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
                          className={`flex-1 ${msg.role === "assistant"
                            ? "bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                            : msg.role === "system"
                              ? "bg-white border border-[#1357E5]/50 rounded-2xl p-3 text-sm italic"
                              : "bg-gray-100 rounded-2xl p-4"
                            }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            {msg.role === 'assistant'
                              ? formatResponse(msg.response ? msg : { response: msg.content, isFormatted: msg.isFormatted, formattedContent: msg.formattedContent })
                              : (typeof msg.content === 'string' ? msg.content : msg.content)
                            }
                          </div>
                        </div>
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="ml-12 mt-2 space-y-2">
                          <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Sources:
                          </div>
                          {msg.sources.map((source, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-gray-200 rounded-lg p-3 text-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-700 hover:text-blue-900 flex items-center gap-1"
                                  >
                                    {idx + 1}. {source.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                                    {source.snippet}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#1357E5] text-white flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {webSearchEnabled ? "Searching the web..." : "Thinking..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {error && (
            <div className="max-w-3xl mx-auto w-full px-6 mb-2">
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-transparent border-t-0 p-4 flex-shrink-0 mb-15">
            <div className="w-full h-full">
              <OneDriveModal
                isOpen={oneDriveModalOpen}
                onClose={() => setOneDriveModalOpen(false)}
                folders={[]}
                files={[]}
                onNavigateUp={() => { }}
                onNavigateToFolder={() => { }}
                onSelectFile={async (fileId, fileName) => {
                  try {
                    const downloaded = await CloudStorageService.downloadOneDriveFile(fileId, fileName);
                    if (downloaded && downloaded.file) {
                      await uploadFileToServer(downloaded.file);
                    }
                    setOneDriveModalOpen(false);
                  } catch (err) {
                    console.error('OneDrive download error', err);
                    setError(err.message || 'OneDrive download failed');
                  }
                }}
              />

              {/* Message Input - with inline file display */}
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-lg border border-gray-200">
                {/* Persona Dropdown */}
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="px-2 py-1 border-0 rounded-lg text-sm focus:outline-none bg-transparent text-blue-600 font-medium cursor-pointer"
                >
                  {personas.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Textarea Container with File Chip Inside */}
                <div className="flex-1 relative flex items-start gap-2 py-1">
                  {/* Uploaded File Chip - INSIDE the input area */}
                  {uploadedFileName && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs flex-shrink-0">
                      {/* File Icon */}
                      <div className="flex items-center justify-center w-4 h-4">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>

                      {/* File Name */}
                      <span className="text-blue-700 font-medium max-w-[120px] truncate">
                        {uploadedFileName}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={clearFile}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full p-0.5"
                        aria-label="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Textarea */}
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
                    className="flex-1 px-2 py-1 bg-transparent border-0 resize-none focus:outline-none placeholder-gray-400 text-gray-700"
                    placeholder="Message"
                    rows="1"
                    style={{ maxHeight: "120px", minHeight: "24px" }}
                  />
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-1">
                  {/* Web Search Toggle */}
                  <button
                    type="button"
                    onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                    className={`p-2 rounded-full transition-colors ${webSearchEnabled
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                    title="Web Search"
                  >
                    <Globe className="w-5 h-5" />
                  </button>

                  {/* Upload Button with Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setUploadDropdownOpen(!uploadDropdownOpen); }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                      disabled={uploading}
                      title="Upload File"
                    >
                      <Upload className="w-5 h-5" />
                    </button>

                    <FileUploadDropdown
                      isOpen={uploadDropdownOpen}
                      onClose={() => setUploadDropdownOpen(false)}
                      onLocalFileSelect={async (e) => {
                        const f = e.target.files && e.target.files[0];
                        if (f) await uploadFileToServer(f);
                        setUploadDropdownOpen(false);
                      }}
                      onGoogleDriveClick={async () => {
                        try {
                          setCloudLoading('google-drive');
                          if (!CloudStorageService.checkGoogleDriveConfig()) {
                            CloudStorageService.showGoogleDriveSetupModal();
                            setCloudLoading(null);
                            return;
                          }

                          await CloudStorageService.loadGoogleAPIs();
                          await CloudStorageService.initializeGoogleDrive();
                          const picked = await CloudStorageService.showGoogleDrivePicker();
                          if (picked && picked.file) {
                            await uploadFileToServer(picked.file);
                          }
                        } catch (err) {
                          console.error('Google Drive error', err);
                          setError(err.message || 'Google Drive upload failed');
                        } finally {
                          setCloudLoading(null);
                          setUploadDropdownOpen(false);
                        }
                      }}
                      onOneDriveClick={async () => {
                        try {
                          setCloudLoading('onedrive');
                          if (!CloudStorageService.checkOneDriveConfig()) {
                            CloudStorageService.showOneDriveSetupModal();
                            setCloudLoading(null);
                            return;
                          }
                          await CloudStorageService.loadMicrosoftGraph();
                          await CloudStorageService.initializeOneDrive();
                          setOneDriveModalOpen(true);
                        } catch (err) {
                          console.error('OneDrive init error', err);
                          setError(err.message || 'OneDrive initialization failed');
                          setCloudLoading(null);
                        } finally {
                          setUploadDropdownOpen(false);
                        }
                      }}
                      cloudLoading={cloudLoading}
                      loading={uploading}
                    />

                    <input type="file" id="hidden-local-upload" accept=".pdf,.docx,.txt,.xlsx,.csv,.json" className="hidden" />
                  </div>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={loading || !message.trim()}
                    className={`p-2 rounded-full transition-all flex items-center justify-center ${loading || !message.trim()
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rename</h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameSubmit();
                  } else if (e.key === 'Escape') {
                    setRenameModalOpen(false);
                    setRenameValue("");
                    setRenameConversationId(null);
                  }
                }}
                className="w-full px-3 py-2 border border-[#155DFC]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new title"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3">
              <button
                onClick={() => {
                  setRenameModalOpen(false);
                  setRenameValue("");
                  setRenameConversationId(null);
                }}
                className="flex-1 px-6 py-2.5 text-base font-semibold text-[#155DFC] bg-white border border-[#155DFC]/50 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={!renameValue.trim()}
                className={`flex-1 px-6 py-2.5 text-base font-semibold rounded-lg transition-colors ${!renameValue.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#155DFC] text-white hover:bg-[#0051D5]'
                  }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;