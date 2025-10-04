import { useEffect, useState } from "react";
import Sidebar from "../../../../common/AIDocsSidebar";
// Using SVG icons as data URIs since PNG files don't exist in public/icons/
const docIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234F46E5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14,2 14,8 20,8'/%3E%3Cline x1='16' y1='13' x2='8' y2='13'/%3E%3Cline x1='16' y1='17' x2='8' y2='17'/%3E%3Cline x1='10' y1='9' x2='8' y2='9'/%3E%3C/svg%3E";
const jsonIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23F59E0B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14,2 14,8 20,8'/%3E%3Cpath d='M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1m4 0a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1'/%3E%3C/svg%3E";
const mdIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310B981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14,2 14,8 20,8'/%3E%3Cpath d='M10 13l2 2 4-4'/%3E%3C/svg%3E";
const pdfIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23DC2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14,2 14,8 20,8'/%3E%3Cpath d='M16 13H8'/%3E%3Cpath d='M16 17H8'/%3E%3Cpath d='M10 9H8'/%3E%3C/svg%3E";
const txtIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14,2 14,8 20,8'/%3E%3Cline x1='16' y1='13' x2='8' y2='13'/%3E%3Cline x1='16' y1='17' x2='8' y2='17'/%3E%3Cline x1='10' y1='9' x2='8' y2='9'/%3E%3C/svg%3E";

function ChatPage() {
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(null);
  const [exportLoading, setExportLoading] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(null);

  // 🔹 Toast notification functions
  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 🔹 Copy message to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  // 🔹 Export full chat in various formats
  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: pdfIcon },
    { value: 'docx', label: 'Word Document', icon: docIcon },
    { value: 'markdown', label: 'Markdown', icon: mdIcon },
    { value: 'json', label: 'JSON Data', icon: jsonIcon },
    { value: 'text', label: 'Plain Text', icon: txtIcon },
  ];

  const exportChat = async (format, messageIndex, messageContent) => {
    if (!activeDoc) {
      showToast("Please select a document to export", "error");
      return;
    }

    setExportLoading(format);
    setExportDropdownOpen(null);

    try {
      let requestBody;
      let endpoint;

      if (messageIndex !== undefined && messageContent) {
        // Individual message export
        endpoint = `http://127.0.0.1:8000/export/message/${format}`;
        requestBody = {
          chat_id: activeDoc,
          message_index: messageIndex,
          message_content: messageContent
        };
      } else {
        // Full chat export
        endpoint = `http://127.0.0.1:8000/export/${format}`;
        requestBody = {
          chat_id: activeDoc,
          include_full_text: true
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      // Get the filename from the response headers or create a default one
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `export.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      const exportType = messageIndex !== undefined ? "Message" : "Chat";
      showToast(`${exportType} exported as ${format.toUpperCase()} successfully!`, "success");
    } catch (error) {
      console.error("Export error:", error);
      showToast(`Failed to export as ${format.toUpperCase()}`, "error");
    } finally {
      setExportLoading(null);
    }
  };

  const toggleExportDropdown = (messageId) => {
    setExportDropdownOpen(exportDropdownOpen === messageId ? null : messageId);
  };

  // 🔹 Text formatting functions
  const formatText = (text) => {
    // Convert **text** to bold and * bullets to actual bullets
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('* ')) {
          return `• ${line.trim().substring(2)}`;
        }
        return line;
      })
      .join('\n');
  };

  const insertBold = () => {
    const textarea = document.getElementById('edit-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
    const beforeText = editContent.substring(0, start);
    const afterText = editContent.substring(end);
    
    const newText = selectedText ? `**${selectedText}**` : '**bold text**';
    const newContent = beforeText + newText + afterText;
    
    setEditContent(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText ? end + 4 : start + 2;
      textarea.setSelectionRange(newCursorPos, selectedText ? newCursorPos : newCursorPos + 9);
    }, 0);
  };

  const insertBullet = () => {
    const textarea = document.getElementById('edit-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = editContent.substring(0, start);
    const afterText = editContent.substring(end);
    
    // Check if we're at the start of a line
    const isStartOfLine = start === 0 || editContent[start - 1] === '\n';
    const bulletText = isStartOfLine ? '* ' : '\n* ';
    
    const newContent = beforeText + bulletText + afterText;
    setEditContent(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + bulletText.length, start + bulletText.length);
    }, 0);
  };

  // 🔹 Edit message functions
  const startEditMessage = (messageId, content) => {
    setEditingMessage(messageId);
    setEditContent(content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingMessage || !activeDoc) return;
    
    try {
      // Update the message in the backend
      const response = await fetch(`${API_URL}/${activeDoc}/message/${editingMessage}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }

      // Update the local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.chat_id === activeDoc 
            ? {
                ...doc,
                messages: doc.messages.map(msg => 
                  msg.message_id === editingMessage 
                    ? { ...msg, content: editContent }
                    : msg
                )
              }
            : doc
        )
      );

      showToast("Message updated successfully!", "success");
      cancelEdit();
    } catch (error) {
      console.error("Error updating message:", error);
      showToast("Failed to update message", "error");
    }
  };

  // 🔹 Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const API_URL = "http://127.0.0.1:8000/chat"; // FastAPI backend

  // 🔹 Load all chats from backend on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // 🔹 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownOpen && !event.target.closest('.export-dropdown')) {
        setExportDropdownOpen(null);
      }
      if (uploadDropdownOpen && !event.target.closest('.upload-dropdown')) {
        setUploadDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportDropdownOpen, uploadDropdownOpen]);

  const fetchChats = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        if (res.status === 404) {
          console.warn("Chat API endpoint not found. Setting empty documents.");
          setDocuments([]);
          return;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading chats", err);
      setDocuments([]); // Ensure documents is always an array
      showToast("Failed to connect to server. Please check if the backend is running.", "error");
    } finally {
      setInitialLoading(false);
    }
  };

  // 🔹 Create a new document (chat)
  const newDocument = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `Untitled ${documents.length + 1}` }),
      });
      const data = await res.json();
      setDocuments((prev) => [...prev, data]);
      setActiveDoc(data.chat_id);
    } catch (err) {
      console.error("Error creating chat", err);
    }
  };

  // 🔹 Open an existing document
  const openDocument = (id) => {
    setActiveDoc(id);
  };

  // 🔹 Rename a document
  const renameDocument = async (id, newTitle) => {
    try {
      // Call backend to update title
      const res = await fetch(`${API_URL}/${id}/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      // Check for specific status codes
      if (res.status === 404) {
        showToast("Chat document not found", "error");
        return;
      }

      if (res.status === 400) {
        const error = await res.json();
        showToast(error.detail || "Invalid title format", "error");
        return;
      }

      if (!res.ok) {
        showToast(`Failed to rename document (Status: ${res.status})`, "error");
        return;
      }

      const updatedDoc = await res.json();

      // Update frontend state only if backend update was successful
      setDocuments((prev) =>
        prev.map((doc) => (doc.chat_id === id ? { ...updatedDoc } : doc))
      );
      
      showToast("Chat renamed successfully!", "success");
    } catch (err) {
      console.error("Error updating title:", err);
      showToast("Network error while updating title. Please try again.", "error");
    }
  };

  const deleteDocument = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete (status ${res.status})`);
      }

      setDocuments((prev) => prev.filter((doc) => doc.chat_id !== id));
      if (activeDoc === id) setActiveDoc(null);

      showToast("Chat deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting chat:", err);
      showToast("Failed to delete chat", "error");
    }
  };

  // 🔹 Handle Google Drive file upload
  const handleGoogleDriveUpload = async () => {
    setCloudLoading('google-drive');
    setUploadDropdownOpen(false);

    try {
      await handleGoogleDriveAuth();
    } catch (error) {
      console.error('Google Drive upload error:', error);
      showToast('Failed to connect to Google Drive', "error");
    } finally {
      setCloudLoading(null);
    }
  };

  // 🔹 Google Drive authentication and file picker
  const handleGoogleDriveAuth = async () => {
    // Check if Google Drive is configured
    const hasGoogleConfig = checkGoogleDriveConfig();
    
    if (!hasGoogleConfig) {
      showGoogleDriveSetupModal();
      return;
    }
    
    showToast("Requesting Google Drive access...", "info");
    
    try {
      // Load Google APIs dynamically
      await loadGoogleAPIs();
      
      // Initialize and authenticate
      await initializeGoogleDrive();
      
      // Show file picker
      await showGoogleDrivePicker();
    } catch (error) {
      if (error.message === 'Google Drive API not configured') {
        showGoogleDriveSetupModal();
      } else {
        throw error;
      }
    }
  };

  const checkGoogleDriveConfig = () => {
    // Check if both Client ID and API Key are set
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    return clientId && apiKey && 
           clientId !== 'YOUR_GOOGLE_CLIENT_ID' && 
           apiKey !== 'YOUR_GOOGLE_API_KEY';
  };

  const showGoogleDriveSetupModal = () => {
    const setupInstructions = `
🔧 Google Drive Setup Required

To enable Google Drive integration:

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google Drive API & Google Picker API
4. Create credentials (API Key + OAuth Client ID)
5. Add your domain to authorized origins

Environment Variables:
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_API_KEY=your_api_key

For detailed setup instructions, see:
https://developers.google.com/drive/api/quickstart/js
    `;
    
    showToast("Google Drive not configured - check console for setup instructions", "error");
    console.log(setupInstructions);
    
    // Optionally open setup documentation
    if (confirm("Open Google Drive API setup documentation?")) {
      window.open('https://developers.google.com/drive/api/quickstart/js', '_blank');
    }
  };

  const loadGoogleAPIs = () => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.accounts && window.google.picker) {
        resolve();
        return;
      }

      // Load Google Identity Services (GIS)
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => {
        // Load Google Picker API
        const pickerScript = document.createElement('script');
        pickerScript.src = 'https://apis.google.com/js/api.js';
        pickerScript.onload = () => {
          window.gapi.load('picker', () => {
            // Load additional picker script
            const pickerApiScript = document.createElement('script');
            pickerApiScript.src = 'https://apis.google.com/js/picker.js';
            pickerApiScript.onload = () => resolve();
            pickerApiScript.onerror = () => reject(new Error('Failed to load Google Picker API'));
            document.head.appendChild(pickerApiScript);
          });
        };
        pickerScript.onerror = () => reject(new Error('Failed to load Google APIs'));
        document.head.appendChild(pickerScript);
      };
      gisScript.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(gisScript);
    });
  };

  const initializeGoogleDrive = async () => {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!CLIENT_ID || !API_KEY || CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' || API_KEY === 'YOUR_GOOGLE_API_KEY') {
      throw new Error('Google Drive API not configured');
    }
    
    try {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
      });

      // Request access token using Google Identity Services
      return new Promise((resolve, reject) => {
        window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response) => {
            if (response.error) {
              reject(new Error(`OAuth error: ${response.error}`));
              return;
            }
            
            // Store the access token for later use
            window.googleAccessToken = response.access_token;
            showToast("Google Drive access granted!", "success");
            resolve(response);
          },
          error_callback: (error) => {
            reject(new Error(`OAuth initialization error: ${error}`));
          }
        }).requestAccessToken();
      });
    } catch (error) {
      console.error('Google Drive initialization error:', error);
      throw new Error('Failed to initialize Google Drive access');
    }
  };

  const showGoogleDrivePicker = () => {
    return new Promise((resolve, reject) => {
      if (!window.googleAccessToken) {
        reject(new Error('No access token available'));
        return;
      }
      
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(window.googleAccessToken)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback(async (data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            try {
              await downloadGoogleDriveFile(file.id, file.name);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else if (data.action === window.google.picker.Action.CANCEL) {
            showToast("File selection cancelled", "info");
            resolve();
          }
        })
        .build();
      
      picker.setVisible(true);
    });
  };

  const downloadGoogleDriveFile = async (fileId, fileName) => {
    try {
      if (!window.googleAccessToken) {
        throw new Error('No access token available');
      }

      // First, get file metadata to determine the file type
      const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`, {
        headers: {
          'Authorization': `Bearer ${window.googleAccessToken}`
        }
      });

      if (!metadataResponse.ok) {
        throw new Error(`Failed to get file metadata: ${metadataResponse.status}`);
      }

      const metadata = await metadataResponse.json();
      const mimeType = metadata.mimeType;
      
      let downloadUrl;
      let exportMimeType;
      let exportFileName = fileName;

      // Check if it's a Google Workspace file that needs to be exported
      if (mimeType === 'application/vnd.google-apps.document') {
        // Google Docs - export as Word document
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.docx';
      } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        // Google Sheets - export as Excel
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.xlsx';
      } else if (mimeType === 'application/vnd.google-apps.presentation') {
        // Google Slides - export as PowerPoint
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation`;
        exportMimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        exportFileName = fileName.replace(/\.[^/.]+$/, '') + '.pptx';
      } else {
        // Regular file - use direct download
        downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        exportMimeType = mimeType;
      }
      
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${window.googleAccessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], exportFileName, { type: exportMimeType });
      
      setFile(file);
      showToast(`File imported from Google Drive: ${exportFileName}`, "success");
    } catch (error) {
      showToast("Failed to download file from Google Drive", "error");
      console.error("Google Drive download error:", error);
      throw error;
    }
  };


  // 🔹 Send message
  const sendMessage = async () => {
    if (!inputText && !file) return;
    if (!activeDoc) {
      showToast("Please select or create a document first", "error");
      return;
    }

    setLoading(true);

    try {
      // Save user message with unique ID
      const userMsg = { 
        role: "user", 
        content: inputText,
        message_id: crypto.randomUUID() // Generate unique ID
      };
      
      await fetch(`${API_URL}/${activeDoc}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMsg),
      });

      // Process file/text with AI
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (inputText) formData.append("text", inputText);

      const res = await fetch("http://127.0.0.1:8000/run_ai_docs/run", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Check if there's an error in the response
      if (!res.ok) {
        // Show the raw error message from backend and save it as AI response
        const errorMessage = data.detail || `Error: ${res.status} ${res.statusText}`;
        showToast(errorMessage, "error");
        
        // Save the error as AI response so it's visible in chat
        const aiMsg = { 
          role: "agent", 
          content: `❌ ${errorMessage}`,
          message_id: crypto.randomUUID()
        };

        await fetch(`${API_URL}/${activeDoc}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aiMsg),
        });

        // Refresh messages to show the error in chat
        const updatedChat = await fetch(`${API_URL}/${activeDoc}`).then((res) =>
          res.json()
        );
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.chat_id === activeDoc ? updatedChat : doc
          )
        );

        setInputText("");
        setFile(null);
        setLoading(false);
        return;
      }

      // Save AI response with unique ID
      const aiMsg = { 
        role: "agent", 
        content: data.response || "No response",
        message_id: crypto.randomUUID() // Generate unique ID
      };

      await fetch(`${API_URL}/${activeDoc}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiMsg),
      });

      // Refresh messages
      const updatedChat = await fetch(`${API_URL}/${activeDoc}`).then((res) =>
        res.json()
      );
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.chat_id === activeDoc ? updatedChat : doc
        )
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to send message", "error");
    }

    setInputText("");
    setFile(null);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && (inputText.trim() || file)) {
      sendMessage();
    }
  };

  const activeMessages = Array.isArray(documents) 
    ? documents.find((doc) => doc.chat_id === activeDoc)?.messages || []
    : [];

  // Show loading screen during initial load
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Docs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white pt-22 text-black">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-2 hover:opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0'} overflow-hidden`}>
        <Sidebar
          documents={Array.isArray(documents) ? documents.map((d) => ({ id: d.chat_id, title: d.title })) : []}
          activeDoc={activeDoc}
          onNewDocument={newDocument}
          onOpenDocument={openDocument}
          onRenameDocument={renameDocument}
          onDeleteDocument={deleteDocument}
        />
      </div>

      {/* Main Chat Container */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Toggle Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">
              {activeDoc && Array.isArray(documents)
                ? documents.find((d) => d.chat_id === activeDoc)?.title || "AI Docs Chat"
                : "AI Docs Chat"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeDoc && (
              <div className="relative export-dropdown">
                <button
                  onClick={() => toggleExportDropdown('header-export')}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Export chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                
                {exportDropdownOpen === 'header-export' && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Export Chat As
                      </div>
                      {exportFormats.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => exportChat(format.value)}
                          disabled={exportLoading === format.value}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <img src={format.icon} alt={format.label} width={16} height={16} className="flex-shrink-0" />
                          <span className="flex-1">{format.label}</span>
                          {exportLoading === format.value && (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-black"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Chat Messages Area - Continue with rest of the component... */}
        <div className="flex-1 overflow-x-hidden p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-4">
            {activeMessages.length === 0 && activeDoc && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Start your conversation</h3>
                <p className="text-gray-500">Ask me anything or upload a document to get started.</p>
              </div>
            )}
            
            {!activeDoc && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to AI Docs</h3>
                <p className="text-gray-500 mb-4">Create a new chat or select an existing one from the sidebar to get started.</p>
                <button
                  onClick={newDocument}
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Create New Chat
                </button>
              </div>
            )}

            {activeMessages.map((msg, index) => (
              <div
                key={msg.message_id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg break-words ${
                    msg.role === "user"
                      ? "bg-black text-white ml-12"
                      : "bg-white border border-gray-200 mr-12"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {msg.role === "user" ? "You" : "AI"}
                        </span>
                      </div>
                      
                      {/* Inline editing for AI messages */}
                      {msg.role === "agent" && editingMessage === msg.message_id ? (
                        <div className="space-y-3">
                          {/* Formatting Toolbar */}
                          <div className="flex gap-2 p-2 bg-gray-50 rounded-lg border">
                            <button
                              onClick={insertBold}
                              className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-xs"
                              title="Add bold text"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                              </svg>
                              Bold
                            </button>
                            
                            <button
                              onClick={insertBullet}
                              className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-xs"
                              title="Add bullet point"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 5h14v2H7zM7 11h14v2H7zM7 17h14v2H7zM3 5h2v2H3zM3 11h2v2H3zM3 17h2v2H3z"/>
                              </svg>
                              Bullet
                            </button>
                          </div>

                          {/* Text Editor */}
                          <textarea
                            id="edit-textarea"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            placeholder="Edit your message..."
                            autoFocus
                          />

                          {/* Preview */}
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="text-xs font-medium text-gray-500 mb-2">Preview:</div>
                            <div 
                              className="text-sm whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: formatText(editContent) }}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="whitespace-pre-wrap break-words overflow-hidden"
                          dangerouslySetInnerHTML={{
                            __html: msg.role === "agent" ? formatText(msg.content) : msg.content
                          }}
                        />
                      )}
                    </div>
                    
                    {msg.role === "agent" && (
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => startEditMessage(msg.message_id, msg.content)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Edit message"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        
                        {/* Export Dropdown */}
                        <div className="relative export-dropdown">
                          <button
                            onClick={() => toggleExportDropdown(`msg-${index}`)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Export message"
                          >
                            {exportLoading && exportDropdownOpen === `msg-${index}` ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-black"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </button>
                          
                          {exportDropdownOpen === `msg-${index}` && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                              <div className="py-2">
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                                  Export Message As
                                </div>
                                {exportFormats.map((format) => (
                                  <button
                                    key={format.value}
                                    onClick={() => exportChat(format.value, index, msg.content)}
                                    disabled={exportLoading === format.value}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <img src={format.icon} alt={format.label} width={16} height={16} className="flex-shrink-0" />
                                    <span className="flex-1">{format.label}</span>
                                    {exportLoading === format.value && (
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-black"></div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-3xl p-4 rounded-lg bg-white border border-gray-200 mr-12">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">AI Assistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-black"></div>
                        <span className="text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        {activeDoc && (
          <div className="border-t border-gray-300 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-3">
                {file && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="ml-auto p-1 hover:bg-gray-200 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 items-end" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="relative flex-shrink-0">
                    {/* Upload Dropdown */}
                    <div className="relative upload-dropdown">
                      <button
                        onClick={() => setUploadDropdownOpen(!uploadDropdownOpen)}
                        className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        title="Upload file"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>

                      {/* Upload Options Dropdown */}
                      {uploadDropdownOpen && (
                        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-64">
                          <div className="py-2">
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                              Upload from
                            </div>
                            
                            {/* Local File Upload */}
                            <label
                              htmlFor="local-file-upload"
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M20 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Local Device</span>
                            </label>
                            <input
                              type="file"
                              id="local-file-upload"
                              onChange={(e) => {
                                setFile(e.target.files ? e.target.files[0] : null);
                                setUploadDropdownOpen(false);
                              }}
                              accept=".pdf,.docx,.txt,.xlsx,.xls,.csv,.json"
                              className="hidden"
                            />
                            
                            {/* Google Drive Option */}
                            <button
                              onClick={handleGoogleDriveUpload}
                              disabled={cloudLoading === 'google-drive'}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.28 3L3.28 8.5L6.28 14h4.44L13.72 8.5L10.72 3H6.28zM14.5 6.5L12 11h8l2.5-4.5H14.5zM16 13L12 20.5L8 13h8z"/>
                              </svg>
                              <span>Google Drive</span>
                              {cloudLoading === 'google-drive' && (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-500"></div>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleKeyDown(e);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.target.focus();
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    disabled={loading}
                    rows={1}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={{ 
                      minHeight: '48px',
                      cursor: loading ? 'not-allowed' : 'text',
                      pointerEvents: loading ? 'none' : 'auto',
                      backgroundColor: loading ? '#f3f4f6' : 'white',
                      zIndex: 10,
                      position: 'relative'
                    }}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={loading || (!inputText.trim() && !file)}
                    className="flex-shrink-0 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;