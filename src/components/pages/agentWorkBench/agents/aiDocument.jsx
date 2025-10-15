import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Menu, Plus, Search, Upload, FileText, Download, ChevronDown } from 'lucide-react';
import axios from 'axios';

const App = () => {
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Document state (from old code)
  const [activeTab, setActiveTab] = useState('upload');
  const [genRequest, setGenRequest] = useState('');
  const [genType, setGenType] = useState('resume');
  const [genLoading, setGenLoading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docFilename, setDocFilename] = useState('');
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDocEdited, setIsDocEdited] = useState(false);
  
  // Dropdown states
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const API_URL = 'http://localhost:8000/document';

  const hasChatStarted = chatMessages.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowGenerateDropdown(false);
        setShowEditDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-save on report content change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (reportId && reportContent) {
        handleEdit();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [reportContent, reportId]);

  // Fetch document content for preview
  const fetchDocumentContent = async (docId) => {
    try {
      const response = await axios.post(`${API_URL}/get_document_content/`, { doc_id: docId });
      setDocContent(response.data.text);
      setDocFilename(response.data.filename);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error fetching document content');
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setIsDocEdited(false);
    const formData = new FormData();
    formData.append('file', file);
    if (prompt) formData.append('prompt', prompt);

    try {
      const response = await axios.post(`${API_URL}/upload_document/`, formData);
      setDocId(response.data.doc_id);
      setReportId(response.data.report_id);
      setReportContent(response.data.report);
      await fetchDocumentContent(response.data.doc_id);
      setError(null);
      setActiveTab('edit');
      
      // Add to chat history
      const newChatTitle = file.name.substring(0, 30);
      setChatHistory(prev => [{ id: Date.now(), title: newChatTitle }, ...prev]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading document');
    }
    setIsLoading(false);
  };

  // Handle paste text
  const handlePasteText = async () => {
    if (!docContent.trim()) {
      setError('Text cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/paste_text/`, {
        text: docContent,
        prompt: prompt || null,
      });
      setDocId(response.data.doc_id);
      setReportId(response.data.report_id);
      setReportContent(response.data.report);
      await fetchDocumentContent(response.data.doc_id);
      setIsDocEdited(false);
      setError(null);
      setActiveTab('edit');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing text');
    }
    setIsLoading(false);
  };

  // Handle document processing prompt
  const handleProcessPrompt = async () => {
    if (!docId || !prompt) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/process_prompt/`, {
        doc_id: docId,
        prompt,
      });
      setReportId(response.data.report_id);
      setReportContent(response.data.report);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing prompt');
    }
    setIsLoading(false);
  };

  // Handle chat with report (real functionality)
  const handleChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    
    if (chatMessages.length === 0) {
      const newChatTitle = trimmed.substring(0, 30) + (trimmed.length > 30 ? '...' : '');
      setChatHistory(prev => [{ id: Date.now(), title: newChatTitle }, ...prev]);
    }
    
    setChatMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const payload = {
        message: trimmed,
        report_id: reportId || null,
        doc_id: docId || null
      };
      const response = await axios.post(`${API_URL}/chat_with_report/`, payload);
      const aiResp = response.data.response || '[No response]';
      
      // Capture generated context
      if (!reportId && response.data.report_id) setReportId(response.data.report_id);
      if (!docId && response.data.doc_id) setDocId(response.data.doc_id);
      if (response.data.generated && response.data.doc_id && response.data.report_id) {
        setDocContent(aiResp);
        setReportContent(aiResp);
        setDocFilename(`generated_${response.data.report_id}.md`);
        setActiveTab('edit');
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResp }]);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error in chat';
      setChatMessages(prev => [...prev, { role: 'ai', content: `⚠ ${msg}` }]);
      setError(msg);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle web research
  const handleResearch = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await axios.post(`${API_URL}/web_research/`, {
        query: trimmed,
        report_id: reportId || null,
      });
      const research = response.data.research || '[No research result]';
      setChatMessages(prev => [...prev, { role: 'ai', content: research }]);
      if (response.data.updated_report_id) {
        setReportId(response.data.updated_report_id);
        setReportContent(prev => `${prev}\n\nResearch: ${research}`);
      }
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error in research';
      setChatMessages(prev => [...prev, { role: 'ai', content: `⚠ ${msg}` }]);
      setError(msg);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle report edit
  const handleEdit = async () => {
    if (!reportId || !reportContent) return;
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/save_report_text/`, {
        report_id: reportId,
        report: reportContent,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving report');
    }
    setIsLoading(false);
  };

  // Handle document save
  const handleDocSave = async () => {
    if (!docId || !docContent.trim()) {
      setError('Document content cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/update_document_text/`, {
        doc_id: docId,
        text: docContent,
        regenerate_report: false,
      });
      await fetchDocumentContent(docId);
      setIsDocEdited(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving document');
    }
    setIsLoading(false);
  };

  const handleDocSaveAndRegen = async () => {
    if (!docId || !docContent.trim()) {
      setError('Document content cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/update_document_text/`, {
        doc_id: docId,
        text: docContent,
        regenerate_report: true,
      });
      if (response.data.report_id) {
        setReportId(response.data.report_id);
        setReportContent(response.data.report);
      }
      await fetchDocumentContent(docId);
      setIsDocEdited(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error saving and regenerating report');
    }
    setIsLoading(false);
  };

  // Handle export
  const handleExport = async (format) => {
    setIsLoading(true);
    try {
      if (docContent.trim()) {
        const resp = await axios.post(`${API_URL}/export_raw/`, { text: docContent, format }, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setError(null);
        setIsLoading(false);
        return;
      }

      let rid = reportId;
      if (!rid) {
        setError('Nothing to export');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/export/`,
        { report_id: rid, format },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error exporting file');
    }
    setIsLoading(false);
  };

  // Track document edits
  const handleDocContentChange = (e) => {
    setDocContent(e.target.value);
    setIsDocEdited(true);
  };

  // Generate structured document
  const handleGenerate = async () => {
    if (!genRequest.trim()) {
      setError('Generation request cannot be empty');
      return;
    }
    setGenLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/generate_document/`, {
        request: genRequest,
        doc_type: genType || null,
      });
      setDocId(response.data.doc_id);
      setReportId(response.data.report_id);
      setDocFilename(response.data.document?.startsWith('#') ? `${genType}_template.md` : response.data.doc_id);
      setDocContent(response.data.document);
      setReportContent(response.data.document);
      setActiveTab('edit');
      
      // Add to chat history
      const newChatTitle = `Generated ${genType}`;
      setChatHistory(prev => [{ id: Date.now(), title: newChatTitle }, ...prev]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error generating document');
    }
    setGenLoading(false);
  };

  const startNewChat = () => {
    setChatMessages([]);
    setDocId(null);
    setReportId(null);
    setDocContent('');
    setReportContent('');
    setDocFilename('');
    setActiveTab('upload');
  };

  // Handle quick file upload from input area
  const handleQuickFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsLoading(true);
    setIsDocEdited(false);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/upload_document/`, formData);
      setDocId(response.data.doc_id);
      setReportId(response.data.report_id);
      setReportContent(response.data.report);
      await fetchDocumentContent(response.data.doc_id);
      setError(null);
      setActiveTab('edit');
      
      // Add to chat history and start chat
      const newChatTitle = selectedFile.name.substring(0, 30);
      setChatHistory(prev => [{ id: Date.now(), title: newChatTitle }, ...prev]);
      setChatMessages([{ role: 'system', content: `Document "${selectedFile.name}" uploaded successfully` }]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading document');
    }
    setIsLoading(false);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="flex h-screen bg-white pt-24">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-[#F8F9FC] flex flex-col overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-[#155DFC] rounded transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">AI Docs Agent</h1>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-[#ECF3FF] px-4 py-3 rounded-xl  hover:border-[#155DFC] transition-colors">
              <Search size={20} strokeWidth={2.5} className="text-blue-600" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-left gap-3 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="text-sm font-semibold text-gray-500 mb-3">Chat</div>
          {chatHistory.map((chat) => (
            <div 
              key={chat.id} 
              className="px-4 py-3 mb-2 hover:bg-white rounded-xl cursor-pointer text-sm text-gray-700 transition-colors flex items-center justify-between group"
            >
              <span className="truncate">{chat.title}</span>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
                <Menu size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg mr-4 transition-colors">
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {docFilename || (chatMessages[0]?.content.substring(0, 40))}
              {chatMessages[0]?.content.length > 40 ? '...' : ''}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {docContent && (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="px-3 py-1.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors flex items-center gap-1"
                  disabled={isLoading}
                >
                  <Download size={16} />
                  PDF
                </button>
                <button 
                  onClick={() => handleExport('word')}
                  className="px-3 py-1.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors flex items-center gap-1"
                  disabled={isLoading}
                >
                  <Download size={16} />
                  Word
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area - Split or Welcome */}
        {!hasChatStarted ? (
          /* Welcome Screen */
          <div className="flex-1 overflow-y-auto p-5"
            style={{
              backgroundImage: 'url(../../../../../public/images/chat_grid_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center max-w-2xl px-6">
                <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
                  AI Docs Agent
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Extract insights from documents with AI Agent
                </h1>
                
                <p className="text-lg text-gray-600 mb-12">
                  Interact with and get answers instantly.
                </p>
              </div>
              
              {/* Input Box moved inside main content */}
              <div className="w-full max-w-4xl px-6">
                <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 pl-3">
                    {/* Generate Dropdown */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => {
                          setShowGenerateDropdown(!showGenerateDropdown);
                          setShowEditDropdown(false);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <FileText size={16} />
                        Generate
                        <ChevronDown size={16} />
                      </button>
                      
                      {showGenerateDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('resume');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Resume</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('policy');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Policy</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('proposal');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Proposal</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('sop');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">SOP</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('report');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Report</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('cover_letter');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Cover Letter</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('job_description');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Job Description</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('generate');
                              setGenType('auto');
                              setShowGenerateDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Generate mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Auto Detect</div>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Dropdown */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => {
                          setShowEditDropdown(!showEditDropdown);
                          setShowGenerateDropdown(false);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        <Upload size={16} />
                        Edit
                        <ChevronDown size={16} />
                      </button>
                      
                      {showEditDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => {
                              setActiveTab('upload');
                              setShowEditDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Upload mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Upload Document</div>
                            <div className="text-xs text-gray-500">Upload and process files</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('upload');
                              setShowEditDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Paste mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                          >
                            <div className="font-medium">Paste Text</div>
                            <div className="text-xs text-gray-500">Paste and edit text directly</div>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('edit');
                              setShowEditDropdown(false);
                              if (!hasChatStarted) {
                                setChatMessages([{ role: 'system', content: 'Edit mode activated' }]);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                            disabled={!docContent}
                          >
                            <div className="font-medium">Edit Existing</div>
                            <div className="text-xs text-gray-500">Edit uploaded documents</div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChat();
                      }
                    }}
                    className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Message"
                    disabled={chatLoading}
                  />
                  
                  <div className="flex items-center gap-2 pr-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx,.pdf,.txt,.md"
                      onChange={handleQuickFileUpload}
                      className="hidden"
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-300 rounded-lg transition-colors"
                      title="Upload Document"
                    >
                      <Paperclip size={20} />
                    </button>
                    
                    <button 
                      onClick={handleResearch}
                      disabled={chatLoading || !chatInput.trim()}
                      className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-300 rounded-lg transition-colors"
                      title="Web Research"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleChat}
                      disabled={chatLoading || !chatInput.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                      title="Send Message"
                    >
                      <Send size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Split Pane Layout - Chat Started */
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="flex gap-6 h-full">
              {/* Left Side - Chat Card */}
              <div className="w-96 bg-[#] rounded-xl  flex flex-col">
                {/* Chat Header */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800">Chat</h3>
                </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.role === 'user' ? (
                      <div className="inline-block bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-md text-sm max-w-[85%] shadow-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="inline-block bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-md text-sm max-w-[85%] shadow-sm">
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

                {/* Chat Input at Bottom */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                  <div className="relative flex items-center bg-white border-2 border-gray-300 rounded-xl hover:border-blue-400 focus-within:border-blue-500 transition-colors shadow-sm">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChat();
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500"
                      placeholder="Message"
                      disabled={chatLoading}
                    />
                    <button 
                      onClick={handleResearch}
                      disabled={chatLoading || !chatInput.trim()}
                      className="p-2 text-gray-600 hover:text-green-600 disabled:text-gray-300 rounded-lg transition-colors"
                      title="Web Research"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleChat}
                      disabled={chatLoading || !chatInput.trim()}
                      className="p-2 mr-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg transition-colors"
                      title="Send"
                    >
                      <Send size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Output Card */}
              <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                {/* Action Buttons Inside Card Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800">
                    {docFilename || 'Document Output'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Upload size={16} />
                      Upload
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        activeTab === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FileText size={16} />
                      Generate
                    </button>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={!docContent}
                    >
                      <FileText size={16} />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
              {/* Upload Tab */}
              {activeTab === 'upload' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload or Paste Document</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <input
                      type="file"
                      accept=".docx,.pdf,.txt,.md"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste Text</label>
                    <textarea
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Paste your document content here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Prompt (Optional)</label>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Summarize this document, Extract key points, etc."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={!file || isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {isLoading ? 'Uploading...' : 'Upload & Process'}
                    </button>
                    <button
                      onClick={handlePasteText}
                      disabled={!docContent.trim() || isLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {isLoading ? 'Processing...' : 'Process Pasted Text'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Structured Document</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select
                      value={genType}
                      onChange={(e) => setGenType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="resume">Resume</option>
                      <option value="policy">Policy</option>
                      <option value="proposal">Proposal</option>
                      <option value="sop">Standard Operating Procedure (SOP)</option>
                      <option value="report">Report</option>
                      <option value="cover_letter">Cover Letter</option>
                      <option value="job_description">Job Description</option>
                      <option value="auto">Auto Detect</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generation Request</label>
                    <textarea
                      value={genRequest}
                      onChange={(e) => setGenRequest(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Describe what you want to generate... e.g., 'Create a modern data engineer resume focusing on distributed systems and cloud pipelines with 5 years of experience'"
                    />
                  </div>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={!genRequest.trim() || genLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {genLoading ? 'Generating...' : 'Generate Document'}
                  </button>
                  
                  <p className="text-sm text-gray-500">Output will automatically load in the Edit tab</p>
                </div>
              </div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Document: {docFilename || 'Untitled'}</h3>
                  {isDocEdited && (
                    <span className="text-sm text-orange-600 font-medium">● Unsaved changes</span>
                  )}
                </div>
                
                <textarea
                  value={docContent}
                  onChange={handleDocContentChange}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm mb-6"
                  placeholder="Document content will appear here..."
                />
                
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleDocSave}
                    disabled={!isDocEdited || !docContent.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Document'}
                  </button>
                  <button
                    onClick={handleDocSaveAndRegen}
                    disabled={!isDocEdited || !docContent.trim() || isLoading}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Save & Regenerate Report
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExport('word')}
                      disabled={isLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export as Word
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      disabled={isLoading}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('markdown')}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export as Markdown
                    </button>
                  </div>
                </div>
              </div>
            )}

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
