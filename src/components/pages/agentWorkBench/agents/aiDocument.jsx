// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [genRequest, setGenRequest] = useState('');
  const [genType, setGenType] = useState('resume');
  const [genLoading, setGenLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
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
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useState(null)[0];
  const [showChatInterface, setShowChatInterface] = useState(false);

  const API_URL = 'http://localhost:8000/document';

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

  // Handle chat with report
  const handleChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setShowChatInterface(true);
    setChatMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setChatInput('');
    setChatLoading(true);
    try {
      // Decide payload: if no context, allow backend structured generator to infer type (no text field)
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

  // Handle export (ensure report exists; if not, generate one from document)
  const handleExport = async (format) => {
    setIsLoading(true);
    try {
      // If the user has unsaved edits in docContent, call export_raw to export directly from text
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

      // Fallback to previous flow if no raw doc content
      let rid = reportId;
      if (!rid) {
        setError('Nothing to export');
        setIsLoading(false);
        return;
      }

      // Now call export endpoint with the report id
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

  // Auto-save on report content change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (reportId && reportContent) {
        handleEdit();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [reportContent, reportId]);

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
    } catch (err) {
      setError(err.response?.data?.detail || 'Error generating document');
    }
    setGenLoading(false);
  };

  // Landing Page View (Before any chat)
  if (!showChatInterface) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center max-w-2xl px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
              AI Chat Bot
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Generate UI
            </h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Components with AI
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Enter a simple prompt to generate stunning UIs
            </p>
          </div>

          {/* Input Section */}
          <div className="relative">
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
              className="w-full px-6 py-4 pr-24 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
              placeholder="Message"
              disabled={chatLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button 
                onClick={handleChat}
                disabled={chatLoading || !chatInput.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface View (After first message)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar: Chat History */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">AI Chat Bot</span>
          </button>
          
          <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">Chat</div>
            <div className="space-y-1">
              {chatMessages.filter(msg => msg.role === 'user').map((msg, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors line-clamp-1"
                >
                  {msg.content}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {chatMessages.length > 0 && chatMessages[0].role === 'user' 
                ? chatMessages[0].content.substring(0, 50) + (chatMessages[0].content.length > 50 ? '...' : '')
                : 'New Chat'
              }
            </h2>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Export Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-6 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {chatLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-6 py-3 rounded-2xl bg-white border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <span className="text-sm text-gray-500 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
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
                className="w-full px-6 py-4 pr-24 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="Message"
                disabled={chatLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  onClick={handleChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
