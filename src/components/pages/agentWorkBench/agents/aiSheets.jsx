// src/components/aiSheets.jsx
import React, { useState, useRef } from 'react';

const AiSheets = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
      setConversation([]); // Reset conversation on new file upload
      setError('');
    } else {
      setError('Please upload a CSV or XLSX file.');
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
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
    formData.append('file', file);
    formData.append('query', query);
    // Append previous conversation for buffer memory
    conversation.forEach(msg => {
      formData.append('conversation', JSON.stringify(msg));
    });

    try {
      const res = await fetch('/api/ai-sheets/query', {  // Updated endpoint path
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to process query');
      }
      const data = await res.json();
      setResponse(data.response);
      setConversation(prev => [...prev, { user: query, ai: data.response }]);
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
    <div style={{
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>AI Sheets Chatbot</h1>
      
      {/* File Upload Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Upload Data File:</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.xlsx"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        />
        {file && <p style={{ color: '#4CAF50', margin: 0 }}>✅ Uploaded: {file.name}</p>}
        {error && <p style={{ color: '#f44336', margin: 0 }}>{error}</p>}
      </div>

      {/* Query Input Section */}
      <form onSubmit={handleQuerySubmit} style={{ marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data... (e.g., 'Summarize sales by region' or 'What are the top 5 products?')"
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px',
              resize: 'vertical',
              fontSize: '14px'
            }}
            disabled={!file || loading}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={clearConversation}
              disabled={conversation.length === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: conversation.length === 0 ? 'not-allowed' : 'pointer',
                opacity: conversation.length === 0 ? 0.5 : 1
              }}
            >
              Clear Conversation
            </button>
            <button
              type="submit"
              disabled={!file || loading || !query.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (!file || loading || !query.trim()) ? 'not-allowed' : 'pointer',
                opacity: (!file || loading || !query.trim()) ? 0.5 : 1
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #ffffff', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginRight: '8px' }}></span>
                  Analyzing...
                </>
              ) : (
                'Submit Query'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Conversation Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Conversation History:</h3>
        {conversation.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No conversation yet. Upload a file and ask a question!</p>
        ) : (
          conversation.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              borderLeft: '4px solid #2196F3'
            }}>
              <div style={{ fontWeight: 'bold', color: '#2196F3', marginBottom: '5px' }}>User:</div>
              <div style={{ color: '#555', marginBottom: '10px' }}>{msg.user}</div>
              <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '5px' }}>AI:</div>
              <div style={{ color: '#333' }}>{msg.ai}</div>
            </div>
          ))
        )}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666'
          }}>
            <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #2196F3', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginRight: '10px' }}></span>
            Processing your query...
          </div>
        )}
        {response && !loading && conversation.length === 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#e8f5e8'
          }}>
            <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '5px' }}>AI Response:</div>
            <div style={{ color: '#333' }}>{response}</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AiSheets;