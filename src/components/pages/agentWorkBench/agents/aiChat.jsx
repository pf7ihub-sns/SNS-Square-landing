import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, Upload, Send, Bot, User, FileText, X, Globe, ExternalLink, Plus, Menu, MessageSquare, MoreVertical } from "lucide-react";
import FileUploadDropdown from './AI_Docs/utils/FileUploadDropdown';
import OneDriveModal from './AI_Docs/utils/OneDriveModal';
import { CloudStorageService } from './AI_Docs/utils/CloudStorageService';

const API_BASE = "http://127.0.0.1:8000";
const personas = ["neutral", "formal", "casual", "technical", "simplified", "friendly"];

const AiChat = () => {
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
      // Call the compatibility conversation endpoint which returns messages
      const response = await fetch(`${API_BASE}/ai-chat/conversation/${conversationId}`);
      if (!response.ok) throw new Error("Failed to load conversation");
      const data = await response.json();
      // Map the messages to the correct format
      const formattedMessages = (data.messages || []).map(msg => ({
        // normalize roles: backend may return 'agent' or 'assistant'
        role: msg.role === "agent" ? "assistant" : (msg.role || "user"),
        content: msg.content,
        sources: msg.sources || [],
        searchEnabled: msg.searchEnabled || msg.search_enabled || false
      }));

      // Set currentConversationId only after a successful load
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
    let html = "<ol class='list-decimal pl-8 space-y-4 my-4'>";
    let currentIndent = 0;
    
    lines.forEach(({ text, indent }) => {
      while (indent > currentIndent) {
        html += "<ol class='list-decimal pl-8 space-y-4 mt-2'>";
        currentIndent++;
      }
      while (indent < currentIndent) {
        html += "</ol>";
        currentIndent--;
      }
      html += `<li class='pl-2 leading-relaxed'>${text}</li>`;
    });
    
    while (currentIndent > 0) {
      html += "</ol>";
      currentIndent--;
    }
    return html + "</ol>";
};

const formatBulletList = (lines) => {
    let html = "<ul class='list-disc pl-8 space-y-4 my-4'>";
    let currentIndent = 0;
    
    lines.forEach(({ text, indent }) => {
      while (indent > currentIndent) {
        html += "<ul class='list-disc pl-8 space-y-4 mt-2'>";
        currentIndent++;
      }
      while (indent < currentIndent) {
        html += "</ul>";
        currentIndent--;
      }
      html += `<li class='pl-2 leading-relaxed'>${text}</li>`;
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
        const padding = "&nbsp;".repeat(indent * 4);
        return `<p class='my-4 leading-relaxed text-gray-700'>${padding}${text}</p>`;
      })
      .join("");
};

const formatResponse = (data) => {
    if (!data) return "No response";
    
    // If this message has stored formatting, use it
    if (data.isFormatted && data.formattedContent) {
      const { html, indentation } = data.formattedContent;
      
      // Apply stored indentation and formatting
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
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"); // Convert tabs to spaces
      
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
            // Handle indentation for nested lists
            if (indentLevel > previousLevel) {
              listContent += "<ol class='list-decimal pl-8 space-y-4 mt-2'>";
            } else if (indentLevel < previousLevel) {
              listContent += "</ol>";
            }
            const content = trimmedLine.replace(/^\d+\.\s/, "");
            listContent += `<li class='pl-2 leading-relaxed'>${content}</li>`;
            previousLevel = indentLevel;
          } else if (trimmedLine) {
            // Close any open nested lists
            while (previousLevel > 0) {
              listContent += "</ol>";
              previousLevel--;
            }
            listContent += `</ol><p class='my-4 leading-relaxed'>${trimmedLine}</p><ol class='list-decimal pl-8 space-y-4 my-4'>`;
          }
        });
        // Close any remaining nested lists
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
            // Handle indentation for nested lists
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
            // Close any open nested lists
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
        // Close any remaining nested lists
        while (previousLevel > 0) {
          listContent += "</ul>";
          previousLevel--;
        }
        if (inList) {
          listContent += "</ul>";
        }
        return <div className="formatted-response" dangerouslySetInnerHTML={{ __html: listContent }} />;
      }

      // For regular text, wrap paragraphs and add proper spacing
      const paragraphs = formatted.split("<br/><br/>").filter(p => p.trim());
      formatted = paragraphs
        .map(p => `<p class='my-4 leading-relaxed text-gray-700'>${p.replace(/<br\/>/g, "</p><p class='my-4 leading-relaxed text-gray-700'>")}</p>`)
        .join("");

      return <div className="formatted-response px-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
    }
    return data.toString();
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
        { 
          role: "system", 
          content: `File uploaded: ${file.name}`,
          isFormatted: false 
        },
      ]);
    } catch (err) {
      setError(err.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Upload helper used by local and cloud flows
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
      const endpoint = currentConversationId ? "/chat" : "/chat";
      const requestBody = {
        query: userMessage,
        persona,
        file_id: fileId,
        web_search: webSearchEnabled
      };

      // If we have a current conversation, include its ID
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

      // If this is a new conversation, set the current conversation ID (backend returns chat_id or session_id)
      if (!currentConversationId) {
        setCurrentConversationId(data.chat_id || data.session_id || null);
      }

      // Store raw response and formatted metadata (do not store rendered JSX)
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
      
      // Refresh the conversations list
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

  const handleRenameConversation = async (sessionId, newTitle) => {
    try {
      // First try the new endpoint
      const response = await fetch(`${API_BASE}/ai-chat/${sessionId}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error("Failed to rename conversation");

      await fetchConversations();
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

      // If the deleted conversation was the current one, clear the chat
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

  // Download helper used by export functions
  const _downloadBlob = async (response, defaultName) => {
    const blob = await response.blob();
    // Try to infer filename from content-disposition
    const cd = response.headers.get('content-disposition') || '';
    let filename = defaultName;
    const match = /filename\*=UTF-8''(.+)$/.exec(cd) || /filename="?([^";]+)"?/.exec(cd);
    if (match && match[1]) {
      try {
        filename = decodeURIComponent(match[1]);
      } catch (e) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportConversation = async (fmt) => {
    if (!currentConversationId) {
      setError('Open a conversation first to export');
      return;
    }

    try {
      // Format the conversation data
      const messages = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.response || msg.content
      }));

      // Match the backend's GET route
      const params = new URLSearchParams({
        include_full_text: 'true',
        messages: JSON.stringify(messages)
      });

      const resp = await fetch(
        `${API_BASE}/ai-chat/export/${fmt}/${currentConversationId}?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': fmt === 'text' ? 'text/plain' : 
                     fmt === 'pdf' ? 'application/pdf' : 
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'Export failed');
      }

      const defaultName = `${currentConversationId}.${fmt === 'text' ? 'txt' : fmt}`;
      await _downloadBlob(resp, defaultName);
    } catch (err) {
      console.error('Export conversation failed', err);
      setError(err.message || 'Export failed');
    }
  };

  const exportMessage = async (fmt, index, content) => {
    try {
      // Get the message to export
      const messageToExport = typeof index === 'number' ? chatHistory[index] : { role: 'assistant', content };
      
      // Build query parameters
      const params = new URLSearchParams({
        message_index: typeof index === 'number' ? index.toString() : '',
        message_content: content || messageToExport.content || '',
        include_full_text: 'true'
      });

      const resp = await fetch(
        `${API_BASE}/ai-chat/export/${fmt}/${currentConversationId}?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': fmt === 'text' ? 'text/plain' : 
                     fmt === 'pdf' ? 'application/pdf' : 
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'Export message failed');
      }

      const ext = fmt === 'text' ? 'txt' : fmt;
      const defaultName = `${currentConversationId}_message_${index ?? 'export'}.${ext}`;
      await _downloadBlob(resp, defaultName);
    } catch (err) {
      console.error('Export message failed', err);
      setError(err.message || 'Export message failed');
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg flex h-[calc(100vh-6rem)] mt-24 w-full overflow-hidden">
        {/* Sidebar */}
  <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden h-full` }>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-800">AI Chat Bot</span>
            </div>
            
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">Chat History</div>
            <div className="space-y-1">
              {conversationsList.map((conv) => (
                <div key={conv.id} className="relative conversation-menu px-2 py-1">
                  <div className="flex items-center w-full group">
                    <button
                      onClick={() => loadConversation(conv.id)}
                      className={`flex-1 text-left px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        currentConversationId === conv.id ? "bg-gray-100" : ""
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
                    <div className="absolute right-2 top-8 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 min-w-[140px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt('Enter new title:', conv.title);
                          if (newTitle) {
                            handleRenameConversation(conv.id, newTitle);
                          }
                          setActiveMenuId(null);
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
  <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 text-center">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                AI Chat Bot
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setActiveMenuId(activeMenuId === 'export' ? null : 'export')}
                className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium flex items-center gap-2"
                disabled={!currentConversationId}
                title={!currentConversationId ? 'Open a conversation to export' : 'Export'}
              >
                Export <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </button>
              {activeMenuId === 'export' && currentConversationId && (
                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 min-w-[140px]">
                  <button onClick={() => { exportConversation('pdf'); setActiveMenuId(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Export as PDF</button>
                  <button onClick={() => { exportConversation('docx'); setActiveMenuId(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Export as DOCX</button>
                  <button onClick={() => { exportConversation('text'); setActiveMenuId(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Export as TXT</button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 min-h-0">
            <div className="max-w-3xl mx-auto h-full">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <Bot className="w-16 h-16 text-blue-600 mb-6" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Start a New Chat
                  </h2>
                  <p className="text-gray-500 max-w-md mb-8">
                    Ask me anything! I'm here to help.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((msg, i) => (
                    <div key={i}>
                      <div className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === "assistant"
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
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
                          className={`flex-1 ${
                            msg.role === "assistant"
                              ? "bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                              : msg.role === "system"
                              ? "bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-sm italic"
                              : "bg-gray-100 rounded-2xl p-4"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            {msg.role === 'assistant'
                              ? formatResponse(msg.response ? msg : { response: msg.content, isFormatted: msg.isFormatted, formattedContent: msg.formattedContent })
                              : (typeof msg.content === 'string' ? msg.content : msg.content)
                            }
                          </div>
                          {msg.role === "assistant" && (
                            <div className="mt-3 relative inline-block">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === `msg-${i}` ? null : `msg-${i}`)}
                                className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 
                                         text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6M3 17a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-6" />
                                </svg>
                                Export
                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                </svg>
                              </button>
                              {activeMenuId === `msg-${i}` && (
                                <div className="absolute left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 w-32">
                                  <button 
                                    onClick={() => { exportMessage('pdf', i); setActiveMenuId(null); }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 group"
                                  >
                                    <svg className="w-4 h-4 text-red-500 group-hover:text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2v8h8v12H4V2h8zm0 0v8h8L12 2z"/>
                                    </svg>
                                    <span className="text-gray-700 group-hover:text-gray-900">PDF</span>
                                  </button>
                                  <button 
                                    onClick={() => { exportMessage('docx', i); setActiveMenuId(null); }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 group"
                                  >
                                    <svg className="w-4 h-4 text-blue-500 group-hover:text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                                    </svg>
                                    <span className="text-gray-700 group-hover:text-gray-900">DOCX</span>
                                  </button>
                                  <button 
                                    onClick={() => { exportMessage('text', i); setActiveMenuId(null); }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 group"
                                  >
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM8 14h8v2H8v-2z"/>
                                    </svg>
                                    <span className="text-gray-700 group-hover:text-gray-900">TXT</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
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
                            {webSearchEnabled ? "Searching the web..." : "AI is thinking..."}
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
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              {/* Controls */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {personas.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={webSearchEnabled}
                    onChange={(e) => setWebSearchEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Globe className={`w-4 h-4 ${webSearchEnabled ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`text-sm ${webSearchEnabled ? 'text-blue-700' : 'text-gray-700'}`}>
                    Web Search
                  </span>
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUploadDropdownOpen(!uploadDropdownOpen); }}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm"
                    disabled={uploading}
                  >
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{uploading ? 'Uploading...' : 'Upload'}</span>
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

                {uploadedFileName && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                    {/* file-type icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white">
                      {uploadedFile && uploadedFile.type?.includes('pdf') ? (
                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
                      ) : uploadedFile && (uploadedFile.type?.includes('word') || uploadedFileName?.endsWith('.doc') || uploadedFileName?.endsWith('.docx')) ? (
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
                      ) : uploadedFile && (uploadedFile.type?.includes('spreadsheet') || uploadedFileName?.endsWith('.xls') || uploadedFileName?.endsWith('.xlsx')) ? (
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
                      ) : uploadedFile && (uploadedFile.type?.includes('json') || uploadedFileName?.endsWith('.json')) ? (
                        <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14v18H5z"/></svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-green-800 truncate font-medium">{uploadedFileName}</div>
                        {uploadedFile && (
                          <div className="text-xs text-gray-500">
                            {(uploadedFile.size && Math.round(uploadedFile.size / 1024) + ' KB') || ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={clearFile}
                      className="ml-1 text-green-600 hover:text-green-800"
                      aria-label="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

              {/* OneDrive modal (uses utils/OneDriveModal) */}
              <OneDriveModal
                isOpen={oneDriveModalOpen}
                onClose={() => setOneDriveModalOpen(false)}
                folders={[]}
                files={[]}
                onNavigateUp={() => {}}
                onNavigateToFolder={() => {}}
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

              {/* Message Input */}
              <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2">
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
                    className="w-full p-3 bg-transparent border-0 resize-none focus:outline-none placeholder-gray-500"
                    placeholder="Message"
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
                      : "bg-blue-600 hover:bg-blue-700"
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
  );
};

export default AiChat;