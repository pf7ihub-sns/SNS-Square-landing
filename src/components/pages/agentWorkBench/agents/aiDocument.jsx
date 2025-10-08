// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [docId, setDocId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000/document';

  // Handle document upload
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (prompt) formData.append('prompt', prompt);

    try {
      const response = await axios.post(`${API_URL}/upload_document/`, formData);
      setDocId(response.data.doc_id);
      if (response.data.report_id) {
        setReportId(response.data.report_id);
        setReportContent(response.data.report);
      }
      setError(null);
    } catch (err) {
      setError('Error uploading document');
    }
    setIsLoading(false);
  };

  // Handle paste text
  const handlePasteText = async () => {
    if (!reportContent) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/paste_text/`, {
        text: reportContent,
        prompt: prompt || null,
      });
      setDocId(response.data.doc_id);
      if (response.data.report_id) {
        setReportId(response.data.report_id);
        setReportContent(response.data.report);
      }
      setError(null);
    } catch (err) {
      setError('Error processing text');
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
      setError('Error processing prompt');
    }
    setIsLoading(false);
  };

  // Handle chat with report
  const handleChat = async () => {
    if (!reportId || !chatInput) return;
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/chat_with_report/`, {
        report_id: reportId,
        message: chatInput,
      });
      setChatMessages([
        ...chatMessages,
        { role: 'user', content: chatInput },
        { role: 'ai', content: response.data.response },
      ]);
      setChatInput('');
      setError(null);
    } catch (err) {
      setError('Error in chat');
    }
    setIsLoading(false);
  };

  // Handle web research
  const handleResearch = async () => {
    if (!chatInput) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/web_research/`, {
        query: chatInput,
        report_id: reportId || null,
      });
      setChatMessages([
        ...chatMessages,
        { role: 'user', content: chatInput },
        { role: 'ai', content: response.data.research },
      ]);
      if (response.data.updated_report_id) {
        setReportId(response.data.updated_report_id);
        setReportContent(response.data.research);
      }
      setChatInput('');
      setError(null);
    } catch (err) {
      setError('Error in research');
    }
    setIsLoading(false);
  };

  // Handle report edit
  const handleEdit = async () => {
    if (!reportId || !reportContent) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/edit_report/`, {
        report_id: reportId,
        changes: reportContent,
      });
      setReportContent(response.data.updated_report);
      setError(null);
    } catch (err) {
      setError('Error saving report');
    }
    setIsLoading(false);
  };

  // Handle export
  const handleExport = async (format) => {
    if (!reportId) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/export/`,
        { report_id: reportId, format },
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
      setError('Error exporting file');
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Chat Interface */}
      <div className="w-1/3 p-4 bg-white shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span
                className={`inline-block p-2 rounded ${
                  msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Ask about the report or research..."
          />
          <button
            onClick={handleChat}
            className="p-2 bg-blue-500 text-white rounded-r"
            disabled={isLoading}
          >
            Chat
          </button>
          <button
            onClick={handleResearch}
            className="p-2 bg-green-500 text-white ml-2 rounded"
            disabled={isLoading}
          >
            Research
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Right Side: Document Interface */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`p-2 ${
              activeTab === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-l`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`p-2 ${
              activeTab === 'process' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Process
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`p-2 ${
              activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-r`}
          >
            Edit
          </button>
        </div>

        {activeTab === 'upload' && (
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <input
              type="file"
              accept=".docx,.pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Optional: Enter a prompt (e.g., Summarize this document)"
            />
            <button
              onClick={handleUpload}
              className="p-2 bg-blue-500 text-white rounded"
              disabled={isLoading}
            >
              Upload
            </button>
            <button
              onClick={handlePasteText}
              className="p-2 bg-blue-500 text-white rounded ml-2"
              disabled={isLoading}
            >
              Paste Text
            </button>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-xl font-bold mb-4">Process Document</h2>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter a prompt (e.g., Summarize Section 3)"
            />
            <button
              onClick={handleProcessPrompt}
              className="p-2 bg-blue-500 text-white rounded"
              disabled={isLoading || !docId}
            >
              Process
            </button>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="bg-white p-4 shadow-md rounded flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Edit Report</h2>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              className="flex-1 p-2 border rounded mb-4 font-mono"
              placeholder="Report content will appear here..."
            />
            <div className="flex">
              <button
                onClick={() => handleExport('word')}
                className="p-2 bg-blue-500 text-white rounded mr-2"
                disabled={isLoading || !reportId}
              >
                Export Word
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="p-2 bg-blue-500 text-white rounded mr-2"
                disabled={isLoading || !reportId}
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="p-2 bg-blue-500 text-white rounded"
                disabled={isLoading || !reportId}
              >
                Export Markdown
              </button>
            </div>
          </div>
        )}
        {isLoading && <p className="text-blue-500 mt-2">Processing...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default App;