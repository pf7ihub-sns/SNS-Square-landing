import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import { Paperclip } from 'lucide-react';

const AiSheets = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [dataPreview, setDataPreview] = useState([]);
  const [summary, setSummary] = useState('');
  const [anomalies, setAnomalies] = useState('');
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('preview');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.tsv'))) {
      try {
        await fetch('http://localhost:8000/ai-sheets/remove-file', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error removing previous file:', error);
      }

      setFile(selectedFile);
      setConversation([]);
      setError('');
      setResponse('');
      setSummary('');
      setAnomalies('');
      setInsights('');
      setActiveView('preview');

      // Read file for preview (up to 50 rows)
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setDataPreview(jsonData.slice(0, 51)); // Show up to 50 rows + header
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setError('Please upload a CSV, XLSX, or TSV file.');
    }
  };

  const handleRemoveFile = async () => {
    try {
      const res = await fetch('http://localhost:8000/ai-sheets/remove-file', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to remove file');
      }
      setFile(null);
      setDataPreview([]);
      setConversation([]);
      setResponse('');
      setSummary('');
      setAnomalies('');
      setInsights('');
      setActiveView('preview');
    } catch (error) {
      console.error('Error removing file:', error);
      setError('Failed to remove file from backend.');
    }
  };

  const handleCellEdit = (rowIdx, colIdx, value) => {
    const updatedData = [...dataPreview];
    updatedData[rowIdx][colIdx] = value;
    setDataPreview(updatedData);
  };

  const handleSaveData = async () => {
    if (!file || !dataPreview.length) {
      setError('No data to save. Please upload a file and edit the data.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(dataPreview));
      formData.append('filename', file.name);
      const response = await fetch('http://localhost:8000/ai-sheets/save-data', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to save edited data');
      }
      const result = await response.json();
      setError(result.message === 'Edited data saved successfully' ? '' : result.message);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save edited data.');
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
    setSummary('');
    setAnomalies('');
    setInsights('');
    setQuery('');
    setActiveView('preview');
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!file || !query.trim()) {
      setError('Please upload a file and enter a query.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('query', query);
    conversation.forEach((msg) => {
      formData.append('conversation', JSON.stringify(msg));
    });

    try {
      const res = await fetch('http://localhost:8000/ai-sheets/query', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to process query');
      }
      const data = await res.json();
      console.log('API Response:', data);
      if (data.is_report) {
        setResponse(data.response);
        setActiveView('response'); // Switch to sidebar view for reports
      } else {
        setConversation((prev) => [...prev, { user: query, ai: data.response }]);
      }
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your query.');
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '25px',
        maxWidth: '1500px',
        margin: '80px auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        minHeight: '90vh',
        display: 'flex',
        gap: '20px',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          AI Sheets
        </div>
        <div
          style={{
            flex: 1,
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#f9fafb',
          }}
        >
          {conversation.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
              Upload a dataset and ask a question to start the conversation!
            </p>
          ) : (
            conversation.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    backgroundColor: '#e6f0ff',
                    padding: '12px 16px',
                    borderRadius: '12px 12px 12px 0',
                    marginRight: '20%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <strong>User:</strong> {msg.user}
                </div>
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px 12px 0 12px',
                    marginLeft: '20%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <ReactMarkdown>{msg.ai}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #1a73e8',
                  borderRadius: '50%',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px',
                }}
              ></span>
              Processing your query...
            </div>
          )}
        </div>
        <form
          onSubmit={handleQuerySubmit}
          style={{
            padding: '20px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '10px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Upload dataset"
          >
            <Paperclip size={20} color="#333" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.tsv"
            style={{ display: 'none' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '12px 20px',
              backgroundColor: loading || !query.trim() ? '#ccc' : '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
          <button
            type="button"
            onClick={clearConversation}
            disabled={conversation.length === 0}
            style={{
              padding: '12px 20px',
              backgroundColor: conversation.length === 0 ? '#ccc' : '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: conversation.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Clear
          </button>
          {file && (
            <button
              type="button"
              onClick={handleRemoveFile}
              style={{
                padding: '12px 20px',
                backgroundColor: '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Remove File
            </button>
          )}
          {file && (
            <button
              type="button"
              onClick={handleSaveData}
              disabled={!file || loading || !dataPreview.length}
              style={{
                padding: '12px 20px',
                backgroundColor: loading || !file || !dataPreview.length ? '#ccc' : '#1a73e8',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !file || !dataPreview.length ? 'not-allowed' : 'pointer',
              }}
            >
              Save
            </button>
          )}
        </form>
        {file && (
          <p style={{ padding: '10px 20px', color: '#4CAF50', margin: '0' }}>
            ✅ Uploaded: {file.name} ({dataPreview.length - 1} rows displayed, up to 50)
          </p>
        )}
        {error && (
          <p style={{ padding: '10px 20px', color: '#f44336', margin: '0' }}>{error}</p>
        )}
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, color: '#333' }}>
            {activeView === 'preview' ? 'Data Preview' : 'Analysis Report'}
          </h3>
          {file && (
            <button
              onClick={() => setActiveView(activeView === 'preview' ? 'response' : 'preview')}
              disabled={!response && activeView === 'preview'}
              style={{
                padding: '8px 16px',
                backgroundColor: response || activeView === 'preview' ? '#1a73e8' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: response || activeView === 'preview' ? 'pointer' : 'not-allowed',
                fontSize: '14px',
              }}
            >
              {activeView === 'preview' ? 'View Report' : 'View Data'}
            </button>
          )}
        </div>
        <div style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
          {file ? (
            activeView === 'preview' ? (
              <div style={{ overflowX: 'auto' }}>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  Showing up to 50 rows of the dataset.
                </p>
                <table
                  style={{
                    width: '100%',
                    minWidth: '600px',
                    borderCollapse: 'collapse',
                    marginBottom: '20px',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', position: 'sticky', top: 0, zIndex: 1 }}>
                      {dataPreview[0]?.map((header, colIdx) => (
                        <th
                          key={colIdx}
                          style={{
                            padding: '10px',
                            textAlign: 'left',
                            border: '1px solid #ddd',
                            whiteSpace: 'nowrap',
                            fontWeight: 'bold',
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataPreview.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx} style={{ borderBottom: '1px solid #ddd', height: '40px' }}>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            style={{
                              padding: '10px',
                              textAlign: 'left',
                              border: '1px solid #ddd',
                              minWidth: '120px',
                              whiteSpace: 'normal',
                            }}
                          >
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleCellEdit(rowIdx + 1, colIdx, e.target.value)}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '4px',
                                fontSize: '14px',
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ReactMarkdown>{response}</ReactMarkdown>
            )
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>
              Upload a dataset to see the preview (up to 50 rows).
            </p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus {
          outline: none;
          background: #e6f0ff;
        }
        table {
          table-layout: auto;
        }
        td, th {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default AiSheets;