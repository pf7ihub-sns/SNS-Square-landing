import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import { Paperclip, Download, Send, X, File as FileIcon, RotateCcw, Sparkles } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const AiSheets = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [dataPreview, setDataPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('preview');
  const [showDataDownloadMenu, setShowDataDownloadMenu] = useState(false);
  const [showReportDownloadMenu, setShowReportDownloadMenu] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const fileInputRef = useRef(null);
  const landingFileInputRef = useRef(null);
  const chartRef = useRef(null);

  const showLandingPage = !file && conversation.length === 0;

  useEffect(() => {
    let chartInstance = null;
    if (visualization && visualization.chart_code && chartRef.current) {
      try {
        const canvas = chartRef.current;
        const ctx = canvas.getContext('2d');
        if (canvas.chart) {
            canvas.chart.destroy();
        }
        const chartFunction = new Function('ctx', 'Chart', visualization.chart_code);
        chartInstance = chartFunction(ctx, window.Chart);
        canvas.chart = chartInstance;
      } catch (err) {
        console.error('Error rendering chart:', err);
        setError('Failed to render visualization.');
      }
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [visualization, activeView]);

  const uploadFileToBackend = async (fileToUpload) => {
    setLoading(true);
    setError('');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        if (workbook.SheetNames.length === 0) throw new Error("File contains no sheets.");
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const formData = new FormData();
        formData.append('data', JSON.stringify(jsonData));
        formData.append('filename', fileToUpload.name);
        const res = await fetch('http://localhost:8000/ai-sheets/save-data', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Backend failed to process file.');
        }
        console.log('File uploaded and saved by backend.');
      } catch (err) {
        console.error('File upload error:', err);
        setError(`Failed to upload: ${err.message}`);
        setFile(null);
        setDataPreview([]);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => { setError('Failed to read file.'); setLoading(false); };
    reader.readAsArrayBuffer(fileToUpload);
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.tsv')) {
      setFile(selectedFile);
      
      if (showLandingPage) {
          // FIX: Changed '#' to '//'
          setQuery(''); // Clear any typed query on landing page if they just upload
      }

      setConversation([]);
      setError('');
      setResponse('');
      setVisualization(null);
      setActiveView('preview');

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        if (workbook.SheetNames.length > 0) {
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setDataPreview(jsonData.slice(0, 51));
        }
      };
      reader.readAsArrayBuffer(selectedFile);
      await uploadFileToBackend(selectedFile);
    } else {
      setError('Please upload a CSV, XLSX, or TSV file.');
    }
    e.target.value = ''; 
  };

  const handleRemoveFile = async () => {
    try {
      await fetch('http://localhost:8000/ai-sheets/remove-file', { method: 'POST' });
      setFile(null);
      setDataPreview([]);
      setConversation([]);
      setResponse('');
      setVisualization(null);
      setActiveView('preview');
      setError('');
    } catch (err) {
      setError('Failed to remove file from backend.');
    }
  };
  
  const handleCellEdit = (rowIdx, colIdx, value) => {
    const updatedData = [...dataPreview];
    updatedData[rowIdx + 1][colIdx] = value;
    setDataPreview(updatedData);
  };

  const handleSaveData = async () => {
    if (!file || !dataPreview.length) return setError('No data to save.');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(dataPreview));
      formData.append('filename', file.name);
      const res = await fetch('http://localhost:8000/ai-sheets/save-data', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to save data');
      alert('Data saved successfully!');
    } catch (error) {
      setError('Failed to save edited data.');
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
    setVisualization(null);
    setQuery('');
    setActiveView('preview');
    setError('');
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        setError("Please upload a dataset using the paperclip icon to begin analysis.");
        return;
    }
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    const currentQuery = query;
    setQuery('');
    const newConversation = [...conversation, { user: currentQuery, ai: '' }];
    setConversation(newConversation);
    const formData = new FormData();
    formData.append('query', currentQuery);
    conversation.forEach((msg) => formData.append('conversation', JSON.stringify(msg)));

    try {
      const res = await fetch('http://localhost:8000/ai-sheets/query', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to process query');
      const data = await res.json();
      if (data.is_report) {
        setResponse(data.response);
        setVisualization(null);
        setActiveView('report');
        setConversation(prev => {
            const updated = [...prev];
            updated[updated.length - 1].ai = "I've generated the report. You can view it in the right panel.";
            return updated;
        });
      } else if (data.visualization) {
        setResponse(data.response);
        setVisualization(data.visualization);
        setActiveView('visualization');
        setConversation(prev => {
            const updated = [...prev];
            updated[updated.length - 1].ai = data.response;
            return updated;
        });
      } else {
         setResponse('');
         setVisualization(null);
         setConversation(prev => {
            const updated = [...prev];
            updated[updated.length - 1].ai = data.response;
            return updated;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your query.');
      // FIX: Changed '#' to '//'
      setConversation(prev => prev.slice(0, -1)); // Remove user query on failure
      setQuery(currentQuery); // Restore query to input
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = (format) => {
    if (!dataPreview.length) return;
    const sanitizedData = dataPreview.map(row => row.map(cell => (cell == null ? '' : String(cell))));
    const filename = file ? `${file.name.split('.')[0]}_preview` : 'data_preview';
    if (format === 'csv') {
      const csvContent = sanitizedData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'excel') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(sanitizedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
    setShowDataDownloadMenu(false);
  };

  const handleDownloadReport = async (format) => {
    const reportContent = response || (visualization ? visualization.explanation : '');
    if (!reportContent) return;
    const filename = 'analysis_report';
    if (format === 'pdf') {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>${filename}</title><style>body{font-family:sans-serif;padding:2rem;line-height:1.6}pre{white-space:pre-wrap;word-wrap:break-word;font-family:inherit}</style></head><body><pre>${reportContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
        printWindow.document.close();
        printWindow.print();
    } else if (format === 'docx') {
      const doc = new Document({ sections: [{ children: reportContent.split('\n').map(line => new Paragraph({ children: [new TextRun(line)] })) }] });
      const blob = await Packer.toBlob(doc);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.docx`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
    setShowReportDownloadMenu(false);
  };

  const renderCommonInputForm = (isLanding) => (
    <form onSubmit={handleQuerySubmit} className={`message-form ${isLanding ? 'landing-form' : ''}`}>
      <input
        type="file"
        ref={isLanding ? landingFileInputRef : fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.tsv"
        style={{ display: 'none' }}
      />
      {!isLanding && (
          <button type="button" onClick={() => fileInput-ref.current.click()} className="icon-button" title="Upload File" disabled={loading}>
            <Paperclip size={20} />
          </button>
      )}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={file ? "Ask a question about your data..." : "Upload a dataset to begin..."}
        className="message-input"
        disabled={loading}
      />
      {isLanding && (
          <button type="button" onClick={() => landingFileInputRef.current.click()} className="icon-button landing-attach" title="Upload File" disabled={loading}>
            <Paperclip size={20} color="#007bff"/>
          </button>
      )}
      <button type="submit" className={`send-button ${isLanding ? 'landing-send' : ''}`} disabled={loading}>
        <Send size={isLanding ? 16 : 18} />
      </button>
    </form>
  );

  const renderLandingPage = () => (
    <div className="landing-container">
      <div className="background-grid"></div>
      <div className="landing-content">
        <div className="pill-label"><Sparkles size={14} style={{marginRight:4}}/> AI Data Analyst</div>
        <h1 className="landing-title">
          Analyze Data<br />
          with <span style={{color: '#333'}}>AI Power</span>
        </h1>
        <p className="landing-subtitle">Upload a CSV or Excel file to generate insights, reports, and visualize trends instantly.</p>
        <div className="landing-search-bar-container">
          {renderCommonInputForm(true)}
        </div>
        {error && <p className="landing-error">{error}</p>}
        {loading && <div className="landing-loader">Uploading and processing...</div>}
      </div>
    </div>
  );

  const renderMainApp = () => (
    <div className="ai-sheets-container">
      <div className="chat-panel">
        <div className="chat-header"><h2>AI Sheets</h2></div>
        <div className="conversation-area">
          {conversation.length === 0 ? (
            <div className="placeholder-text"><p>Dataset uploaded. Ask a question to start analyzing!</p></div>
          ) : (
            conversation.map((msg, idx) => (
              <div key={idx} className="conversation-turn">
                <div className="user-message-bubble">{msg.user}</div>
                {msg.ai && <div className="ai-response-area markdown-content"><ReactMarkdown>{msg.ai}</ReactMarkdown></div>}
              </div>
            ))
          )}
          {loading && <div className="loader"><span className="spinner"></span>Processing...</div>}
        </div>
        <div className="message-input-area">
          {file && (
            <div className="file-chip">
              <FileIcon size={16} /><span>{file.name}</span>
              <button onClick={handleRemoveFile} className="remove-file-btn" title="Remove file"><X size={16} /></button>
            </div>
          )}
          <div className="input-toolbar">
            {renderCommonInputForm(false)}
            <button onClick={clearConversation} className="icon-button" title="Clear Conversation" disabled={conversation.length === 0 || loading}><RotateCcw size={20}/></button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
      <div className="display-panel">
        <div className="display-header">
          <h3 className="display-title">{file ? `${file.name}` : 'Data Display'}</h3>
          <div className="display-controls">
            <button onClick={handleSaveData} className="view-button" disabled={loading || !file || !dataPreview.length} >Save Edits</button>
            {response && <button className={`view-button ${activeView === 'report' ? 'active' : ''}`} onClick={() => setActiveView('report')}>View Report</button>}
            {(visualization) && <button className={`view-button ${activeView === 'visualization' ? 'active' : ''}`} onClick={() => setActiveView('visualization')}>View Chart</button>}
            {dataPreview.length > 0 && <button className={`view-button ${activeView === 'preview' ? 'active' : ''}`} onClick={() => setActiveView('preview')}>View Data</button>}
            <div style={{ position: 'relative' }}>
              <button onClick={() => activeView === 'preview' ? setShowDataDownloadMenu(p => !p) : setShowReportDownloadMenu(p => !p)} className="icon-button" title="Download" disabled={!file}><Download size={20} /></button>
              {showDataDownloadMenu && activeView === 'preview' && (
                <div className="download-menu">
                  <div className="download-menu-header">Export Data</div>
                  <button onClick={() => handleDownloadData('csv')}>CSV</button>
                  <button onClick={() => handleDownloadData('excel')}>Excel</button>
                </div>
              )}
              {showReportDownloadMenu && (activeView === 'report' || activeView === 'visualization') && (
                <div className="download-menu">
                  <div className="download-menu-header">Export Report</div>
                  <button onClick={() => handleDownloadReport('pdf')}>PDF</button>
                  <button onClick={() => handleDownloadReport('docx')}>Word</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="display-content">
            {!file ? <div className="placeholder-text">No data loaded.</div> : 
             activeView === 'report' ? <div className="markdown-content"><ReactMarkdown>{response}</ReactMarkdown></div> :
             activeView === 'visualization' ? (<div><canvas ref={chartRef} id="myChart" style={{ maxHeight: '500px', width: '100%' }}></canvas>{visualization?.explanation && <p className="explanation-text">{visualization.explanation}</p>}</div>) :
             (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr>{dataPreview[0]?.map((header, colIdx) => <th key={colIdx}>{header}</th>)}</tr></thead>
                  <tbody>
                    {dataPreview.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx}>
                            <input type="text" value={cell ?? ''} onChange={(e) => handleCellEdit(rowIdx, colIdx, e.target.value)} className="table-cell-input" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             )
            }
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showLandingPage ? renderLandingPage() : renderMainApp()}
      <style>{`
        /* All existing styles are correct and remain the same */
        :root { --primary: #007bff; --bg-light: #f7f8fc; --border: #e0e0e0; --text-dark: #333; --text-light: #666; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #fff; }
        .landing-container { position: relative; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #fff; }
        .background-grid { position: absolute; inset: 0; z-index: 0; background-size: 60px 60px; background-image: linear-gradient(to right, rgba(0, 123, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 123, 255, 0.05) 1px, transparent 1px); }
        .background-grid::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 20%, #fff 80%); }
        .landing-content { position: relative; z-index: 1; text-align: center; max-width: 700px; padding: 20px; display: flex; flex-direction: column; align-items: center; }
        .pill-label { display: inline-flex; align-items: center; color: var(--primary); border: 1px solid var(--primary); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px; background-color: rgba(0, 123, 255, 0.04); }
        .landing-title { font-size: 56px; line-height: 1.1; font-weight: 700; color: #000; margin: 0 0 16px 0; letter-spacing: -1px; }
        .landing-subtitle { font-size: 18px; color: var(--text-light); margin: 0 0 40px 0; max-width: 500px; }
        .landing-search-bar-container { width: 100%; max-width: 600px; position: relative; }
        .landing-form { background: #fff; border: 1px solid #2f4f4f; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); padding: 8px; border-radius: 16px; transition: box-shadow 0.2s, border-color 0.2s; }
        .landing-form:focus-within { box-shadow: 0 15px 40px -10px rgba(0, 123, 255, 0.15); border-color: #2f4f4f; }
        .landing-form .message-input { font-size: 16px; padding: 12px 16px; }
        .landing-attach { padding: 10px; margin-right: 4px; }
        .landing-send { background-color: var(--primary); color: white; border-radius: 6px; padding: 1px 14px; transition: background 0.2s; }
        .landing-send:hover:not(:disabled) { background-color: #0056b3; }
        .landing-error { color: #d93025; background: #ffebeb; padding: 10px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .landing-loader { margin-top: 20px; color: var(--primary); font-weight: 500; }
        .ai-sheets-container { display: flex; gap: 20px; margin-top:90px ;padding: 20px; height: 85vh; box-sizing: border-box; background-color: var(--bg-light); animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .chat-panel, .display-panel { padding:1px ; flex: 1; display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .chat-header, .display-header { padding: 14px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; background: #fff; }
        .chat-header h2 { margin: 0; font-size: 17px; font-weight: 600; color: var(--text-dark); display: flex; align-items: center; gap: 8px; }
        .chat-header h2::before { content: ""; display: inline-block; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; }
        .conversation-area { flex-grow: 1; overflow-y: auto; padding: 20px; scroll-behavior: smooth; }
        .conversation-turn { margin-bottom: 24px; }
        .user-message-bubble { background-color: #f0f2f5; color: var(--text-dark); padding: 10px 16px; border-radius: 18px 18px 4px 18px; display: inline-block; max-width: 85%; font-size: 14.5px; align-self: flex-end; margin-left: auto; }
        .ai-response-area {color: var(--text-dark); max-width: 95%; }
        .message-input-area { padding: 16px; border-top: 1px solid var(--border); background-color: #fff; }
        .file-chip { display: inline-flex; align-items: center; background-color: #eef3f8; color: #444; padding: 4px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 10px; border: 1px solid #dce5f2; }
        .file-chip span { margin: 0 8px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remove-file-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; border-radius: 4px; color: #888; }
        .remove-file-btn:hover { background-color: rgba(0,0,0,0.05); color: #d93025; }
        .input-toolbar { display: flex; gap: 10px; align-items: center; width:30 px}
        .message-form { display: flex; align-items: center; background-color: #f0f2f5; border: 1px solid var(--primary); border-radius: 24px; padding: 4px; flex-grow: 1; transition: border-color 0.2s, background 0.2s; }
        .message-form:not(.landing-form):focus-within { border-color: #0056b3; background-color: #fff; box-shadow: 0 0 0 2px rgba(0,123,255,0.1); }
        .message-input { flex-grow: 1; border: none; outline: none; padding: 10px 12px; font-size: 14.5px; background-color: transparent; color: var(--text-dark); }
        .icon-button { background: none; border: none; cursor: pointer; color: #777; padding: 8px; border-radius: 50%; display: flex; align-items: center; transition: background 0.2s, color 0.2s; }
        .icon-button:hover:not(:disabled) { background-color: #e9ecef; color: var(--text-dark); }
        .send-button { background-color: var(--primary); color: white; border: none; border-radius: 50%; width: 45px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; margin-right: 2px; }
        .send-button:hover:not(:disabled) { background-color: #0056b3; }
        button:disabled { opacity: 0.5; cursor: not-allowed !important; }
        .loader { display: flex; align-items: center; justify-content: center; gap: 8px; color: #777; font-size: 13px; margin: 10px 0; }
        .spinner { width: 14px; height: 14px; border: 2px solid #ccc; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-text { color: #d93025; font-size: 13px; margin-top: 8px; padding-left: 8px; }
        .display-header { display: flex; justify-content: space-between; align-items: center; }
        .display-title { margin: 0; font-size: 15px; font-weight: 600; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
        .display-controls { display: flex; align-items: center; gap: 8px; }
        .view-button { background: none; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: #555; transition: all 0.2s; }
        .view-button:hover:not(:disabled) { background-color: #f0f2f5; color: var(--text-dark); }
        .view-button.active { background-color: #e7f1ff; color: var(--primary); }
        .download-menu { position: absolute; top: 100%; right: 0; margin-top: 4px; background-color: white; border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; width: 140px; overflow: hidden; animation: slideDown 0.15s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .download-menu-header { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #999; background: #fafafa; border-bottom: 1px solid #eee; }
        .download-menu button { display: block; width: 100%; padding: 10px 12px; background: none; border: none; text-align: left; cursor: pointer; font-size: 13.5px; color: var(--text-dark); transition: background 0.1s; }
        .download-menu button:hover { background-color: #f7f8fc; }
        .display-content { flex-grow: 1; overflow: auto; padding: 2px; position: relative; }
        .placeholder-text { position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); color: #999; font-size: 14px; }
        .data-table { width: 100%; padding:50px; margin:20px ;border-spacing: 0; border: 1px solid var(--border); font-size: 13.5px; font-variant-numeric: tabular-nums; }
        .data-table th { padding: 10px 12px; background-color: #f8f9fa; font-weight: 600; color: #444; text-align: left; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); position: sticky; top: 0; z-index: 10; }
        .data-table td { padding: 0; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); background: #fff; }
        .table-cell-input { width: 100%; border: none; padding: 10px 12px; font-size: 13.5px; font-family: inherit; background: transparent; outline: none; box-sizing: border-box; }
        .table-cell-input:focus { box-shadow: inset 0 0 0 2px var(--primary); z-index: 2; position: relative; }
        .explanation-text { padding: 20px; font-size: 14.5px; line-height: 1.6; color: #444; border-top: 1px solid var(--border); background: #fafafa; }
        .markdown-content { padding: 25px; line-height: 1.7; font-size: 15px; color: #24292e; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; line-height: 1.25; }
        .markdown-content h1 { font-size: 1.8em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-content h2 { font-size: 1.4em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-content p, .markdown-content ul, .markdown-content ol { margin-bottom: 16px; }
        .markdown-content ul, .markdown-content ol { padding-left: 2em; }
        .markdown-content code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(27,31,35,0.05); border-radius: 3px; font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace; }
        .markdown-content pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 6px; }
        .markdown-content pre code { background-color: transparent; padding: 0; }
      `}</style>
    </>
  );
};

export default AiSheets;