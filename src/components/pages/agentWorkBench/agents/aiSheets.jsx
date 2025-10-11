import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import { Paperclip, Download, Send, X, File as FileIcon, RotateCcw, Sparkles, Clipboard, RefreshCw } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import remarkGfm from 'remark-gfm';

const AiSheets = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [visualizationResponse, setVisualizationResponse] = useState(''); // New state for visualization explanation
  const [dataPreview, setDataPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('preview');
  const [showDataDownloadMenu, setShowDataDownloadMenu] = useState(false);
  const [showReportDownloadMenu, setShowReportDownloadMenu] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const fileInputRef = useRef(null);
  const landingFileInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const showLandingPage = !file && conversation.length === 0;

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => setCopiedIndex(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

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
        await res.json();
        console.log('File uploaded and saved by backend, session is active.');
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
        setQuery('');
      }
      setConversation([]);
      setError('');
      setResponse('');
      setVisualizationResponse(''); // Reset visualization response
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
      setVisualizationResponse(''); // Reset visualization response
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
      await res.json();
      alert('Edits saved successfully! The AI will now use this updated version.');
    } catch (error) {
      setError('Failed to save edited data.');
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
    setVisualizationResponse(''); // Reset visualization response
    setVisualization(null);
    setQuery('');
    setActiveView('preview');
    setError('');
  };

  const executeQuery = async (queryText, history) => {
    const formData = new FormData();
    formData.append('query', queryText);
    history.forEach((msg) => formData.append('conversation', JSON.stringify(msg)));
    try {
      const res = await fetch('http://localhost:8000/ai-sheets/query', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to process query');
      return await res.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleBackendResponse = (data) => {
    let aiReply = data.response;

    if (data.is_report) {
      // It's a report. Update report state and set chat message.
      setResponse(data.response);
      setVisualizationResponse(''); // Clear visualization response
      setVisualization(null);
      setActiveView('report');
      aiReply = "I've generated the report. You can view it in the right panel.";
    } else if (data.visualization) {
      // It's a visualization. Update visualization state and explanation, but not report state.
      setVisualizationResponse(data.response); // Store visualization explanation
      setVisualization(data.visualization);
      setActiveView('visualization');
      aiReply = "I've generated a visualization, which you can view in the right panel.";
    } else {
      // It's a standard chat message. Do not update report or visualization state.
    }
    return aiReply;
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a dataset to begin analysis.");
      return;
    }
    if (!query.trim()) return;

    const currentQuery = query;
    setQuery('');
    setLoading(true);
    setError('');

    setConversation(prev => [...prev, { user: currentQuery, ai: '' }]);

    try {
      const data = await executeQuery(currentQuery, conversation);
      const aiReply = handleBackendResponse(data);
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1].ai = aiReply;
        return newConv;
      });
    } catch (error) {
      setError('An error occurred while processing your query.');
      setConversation(prev => prev.slice(0, -1));
      setQuery(currentQuery);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (conversation.length === 0 || loading || isRegenerating) return;
    const lastTurn = conversation[conversation.length - 1];
    const history = conversation.slice(0, -1);

    setIsRegenerating(true);
    setConversation(prev => {
      const newConv = [...prev];
      newConv[newConv.length - 1].ai = '';
      return newConv;
    });

    try {
      const data = await executeQuery(lastTurn.user, history);
      const aiReply = handleBackendResponse(data);
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1].ai = aiReply;
        return newConv;
      });
    } catch (error) {
      setError('Failed to regenerate response.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
    });
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
    const reportContent = activeView === 'visualization' ? visualizationResponse : response; // Use appropriate content based on active view
    if (!reportContent) return;
    const filename = 'analysis_report';
    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`<html><head><title>${filename}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:2rem;line-height:1.6;color:#333}ul,ol{padding-left:2em}li{margin-top:0.25em}h1,h2,h3{color:#000}pre{white-space:pre-wrap;word-wrap:break-word;background:#f6f8fa;padding:15px;border-radius:5px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}</style></head><body><div class="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>${reportContent}</ReactMarkdown></div></body></html>`);
      printWindow.document.close();
      printWindow.document.body.innerHTML = `<pre style="white-space: pre-wrap; font-family: sans-serif;">${reportContent}</pre>`;
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
      <input type="file" ref={isLanding ? landingFileInputRef : fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx,.tsv" style={{ display: 'none' }} />
      {!isLanding && (<button type="button" onClick={() => fileInputRef.current.click()} className="icon-button" title="Upload File" disabled={loading || isRegenerating}><Paperclip size={20} /></button>)}
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={file ? "Ask a question about your data..." : "Upload a dataset to begin..."} className="message-input" disabled={loading || isRegenerating} />
      {isLanding && (<button type="button" onClick={() => landingFileInputRef.current.click()} className="icon-button landing-attach" title="Upload File" disabled={loading}><Paperclip size={20} color="#007bff"/></button>)}
      <button type="submit" className={`send-button ${isLanding ? 'landing-send' : ''}`} disabled={loading || isRegenerating}><Send size={isLanding ? 16 : 18} /></button>
    </form>
  );

  const renderLandingPage = () => (
    <div className="landing-container">
      <div className="background-grid"></div>
      <div className="landing-content">
        <div className="pill-label"><Sparkles size={14} style={{marginRight:4}}/> AI Data Analyst</div>
        <h1 className="landing-title">Analyze Data<br />with <span style={{color: '#333'}}>AI Power</span></h1>
        <p className="landing-subtitle">Upload a CSV or Excel file to generate insights, reports, and visualize trends instantly.</p>
        <div className="landing-search-bar-container">{renderCommonInputForm(true)}</div>
        {error && <p className="landing-error">{error}</p>}
        {loading && <div className="landing-loader">Uploading and processing...</div>}
      </div>
    </div>
  );

  return (
    <>
      {showLandingPage ? renderLandingPage() : (
        <div className="ai-sheets-container">
          <div className="chat-panel">
            <div className="chat-header">
              <div style={{display:'flex', alignItems:'center', gap:'8px', color:'var(--primary)'}}>
                <Sparkles size={18} />
                <h2 style={{margin:0, fontSize:'16px', fontWeight:'600', color:'#333'}}>AI Sheets</h2>
              </div>
            </div>
            <div className="conversation-area">
              {conversation.length === 0 ? (
                <div className="placeholder-text">
                  <Sparkles size={24} style={{marginBottom:'10px', color:'#ccc'}}/>
                  <p>Dataset uploaded.</p>
                  <p style={{fontSize:'13px', marginTop:'5px'}}>Ask a question to generate insights, reports, or charts.</p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    <div className="conversation-turn user"><div className="user-message-bubble">{msg.user}</div></div>
                    <div className="conversation-turn ai">
                      {msg.ai ? (
                        <div className="ai-message-container">
                          <div className="markdown-content chat-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.ai}</ReactMarkdown></div>
                          <div className="action-icons">
                            <button className="action-icon-button" title="Copy" onClick={() => handleCopy(msg.ai, idx)}>{copiedIndex === idx ? <span style={{fontSize:'12px'}}>Copied!</span> : <Clipboard size={14} />}</button>
                            {idx === conversation.length - 1 && !loading && !isRegenerating && (<button className="action-icon-button" title="Regenerate" onClick={handleRegenerate}><RefreshCw size={14} /></button>)}
                          </div>
                        </div>
                      ) : (
                        (loading || isRegenerating) && idx === conversation.length - 1 && (<div className="ai-message-container"><div className="typing-indicator"><span></span><span></span><span></span></div></div>)
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}
              <div ref={conversationEndRef} />
            </div>
            <div className="message-input-area">
              {file && (<div className="file-chip"><FileIcon size={14} /><span>{file.name}</span><button onClick={handleRemoveFile} className="remove-file-btn" title="Remove file"><X size={14} /></button></div>)}
              <div className="input-toolbar">{renderCommonInputForm(false)}<button onClick={clearConversation} className="icon-button" title="Clear Conversation" disabled={conversation.length === 0 || loading || isRegenerating}><RotateCcw size={20}/></button></div>
              {error && <p className="error-text">{error}</p>}
            </div>
          </div>
          <div className="display-panel">
            <div className="display-header">
              <h3 className="display-title">{file ? `${file.name}` : 'Data View'}</h3>
              <div className="display-controls">
                <button onClick={handleSaveData} className="view-button" disabled={loading || isRegenerating || !file || !dataPreview.length} >Save Edits</button>
                {response && <button className={`view-button ${activeView === 'report' ? 'active' : ''}`} onClick={() => setActiveView('report')}>View Report</button>}
                {visualization && <button className={`view-button ${activeView === 'visualization' ? 'active' : ''}`} onClick={() => setActiveView('visualization')}>View Chart</button>}
                {dataPreview.length > 0 && <button className={`view-button ${activeView === 'preview' ? 'active' : ''}`} onClick={() => setActiveView('preview')}>View Data</button>}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => activeView === 'preview' ? setShowDataDownloadMenu(p => !p) : setShowReportDownloadMenu(p => !p)} className="icon-button" title="Download" disabled={!file}><Download size={18} /></button>
                  {showDataDownloadMenu && activeView === 'preview' && (<div className="download-menu"><div className="download-menu-header">Export Data</div><button onClick={() => handleDownloadData('csv')}>CSV</button><button onClick={() => handleDownloadData('excel')}>Excel</button></div>)}
                  {showReportDownloadMenu && (activeView === 'report' || activeView === 'visualization') && (<div className="download-menu"><div className="download-menu-header">Export Report</div><button onClick={() => handleDownloadReport('pdf')}>PDF</button><button onClick={() => handleDownloadReport('docx')}>Word</button></div>)}
                </div>
              </div>
            </div>
            <div className="display-content">
              {!file ? <div className="placeholder-text">Provide data to see output here.</div> :
                activeView === 'report' ? <div className="markdown-content report-view"><ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown></div> :
                activeView === 'visualization' ? (
                  <div style={{padding:'20px', boxSizing:'border-box', height:'100%', display:'flex', flexDirection:'column', gap:'20px'}}>
                    {visualization?.image ? (
                        <div style={{flexShrink: 1, maxHeight: '60%', textAlign: 'center'}}>
                            <img src={`data:image/png;base64,${visualization.image}`} alt="Visualization" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                    ) : (<div className="placeholder-text">Could not render visualization.</div>)}
                    {visualizationResponse && (<div className="markdown-content report-view" style={{borderTop:'1px solid var(--border)', paddingTop:'20px', flexGrow:1, overflowY:'auto'}}><ReactMarkdown remarkPlugins={[remarkGfm]}>{visualizationResponse}</ReactMarkdown></div>)}
                  </div>
                ) :
                (<div style={{ overflow: 'auto', height:'100%' }}><table className="data-table"><thead><tr>{dataPreview[0]?.map((header, colIdx) => <th key={colIdx}>{header}</th>)}</tr></thead><tbody>{dataPreview.slice(1).map((row, rowIdx) => (<tr key={rowIdx}>{row.map((cell, colIdx) => (<td key={colIdx}><input type="text" value={cell ?? ''} onChange={(e) => handleCellEdit(rowIdx, colIdx, e.target.value)} className="table-cell-input" /></td>))}</tr>))}</tbody></table></div>)
              }
            </div>
          </div>
        </div>
      )}
      <style>{`
        :root { --primary: #007bff; --bg-light: #f7f8fc; --border: #e0e0e0; --text-dark: #1a1a1a; --text-med: #555; --text-light: #888; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #fff; color: var(--text-dark); }
        .landing-container { position: relative; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #fff; }
        .background-grid { position: absolute; inset: 0; z-index: 0; background-size: 60px 60px; background-image: linear-gradient(to right, rgba(0, 123, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 123, 255, 0.05) 1px, transparent 1px); }
        .background-grid::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 20%, #fff 80%); }
        .landing-content { position: relative; z-index: 1; text-align: center; max-width: 700px; padding: 20px; display: flex; flex-direction: column; align-items: center; }
        .pill-label { display: inline-flex; align-items: center; color: var(--primary); border: 1px solid var(--primary); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px; background-color: rgba(0, 123, 255, 0.04); }
        .landing-title { font-size: 56px; line-height: 1.1; font-weight: 700; color: #000; margin: 0 0 16px 0; letter-spacing: -1px; }
        .landing-subtitle { font-size: 18px; color: var(--text-med); margin: 0 0 40px 0; max-width: 500px; }
        .landing-search-bar-container { width: 100%; max-width: 600px; position: relative; }
        .landing-form { background: #fff; border: 1px solid #eaeaea; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); padding: 8px; border-radius: 16px; transition: box-shadow 0.2s, border-color 0.2s; }
        .landing-form:focus-within { box-shadow: 0 15px 40px -10px rgba(0, 123, 255, 0.15); border-color: #b3d7ff; }
        .landing-form .message-input { font-size: 16px; padding: 12px 16px; }
        .landing-attach { padding: 10px; margin-right: 4px; }
        .landing-send { background-color: var(--primary); color: white; border-radius: 12px; padding: 10px 14px; transition: background 0.2s; }
        .landing-send:hover:not(:disabled) { background-color: #0056b3; }
        .landing-error { color: #d93025; background: #ffebeb; padding: 10px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .landing-loader { margin-top: 20px; color: var(--primary); font-weight: 500; }
        .ai-sheets-container { display: flex; gap: 20px; margin-top:90px; padding: 20px; height: 85vh; box-sizing: border-box; background-color: var(--bg-light); animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .chat-panel, .display-panel { padding:0; flex: 1; display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .chat-header, .display-header { padding: 12px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; background: #fff; display: flex; align-items: center; justify-content: space-between; height: 50px; box-sizing: border-box; }
        .display-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
        .display-controls { display: flex; align-items: center; gap: 6px; }
        .view-button { background: transparent; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-med); transition: all 0.2s; }
        .view-button:hover:not(:disabled) { background-color: #f5f5f5; color: var(--text-dark); }
        .view-button.active { background-color: #eef6fc; color: var(--primary); font-weight: 600; }
        .view-button:disabled { opacity: 0.4; cursor: not-allowed; }
        .conversation-area { flex-grow: 1; overflow-y: auto; padding: 20px; scroll-behavior: smooth; background-color: #fff; display: flex; flex-direction: column; }
        .conversation-turn { display: flex; width: 100%; margin-bottom: 20px; }
        .conversation-turn.user { justify-content: flex-end; }
        .conversation-turn.ai { justify-content: flex-start; }
        .user-message-bubble { background-color: var(--primary); color: white; padding: 10px 16px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 14.5px; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.1); word-wrap: break-word; }
        .ai-message-container { max-width: 90%; display: flex; flex-direction: column; align-items: flex-start; }
        .chat-markdown { font-size: 14.5px; line-height: 1.6; color: var(--text-dark); }
        .chat-markdown p { margin: 0 0 10px 0; }
        .chat-markdown p:last-child { margin-bottom: 0; }
        .action-icons { display: flex; align-items: center; gap: 4px; margin-top: 6px; opacity: 0; transition: opacity 0.2s; }
        .conversation-turn.ai:hover .action-icons { opacity: 1; }
        .action-icon-button { background: transparent; border: none; cursor: pointer; color: #999; padding: 4px; border-radius: 4px; display: flex; align-items: center; gap: 4px; font-size: 12px; transition: all 0.2s; }
        .action-icon-button:hover { background-color: #f5f5f5; color: var(--text-med); }
        .typing-indicator { display: inline-flex; align-items: center; gap: 4px; padding: 8px 12px; background: #f5f5f5; border-radius: 18px 18px 18px 4px; }
        .typing-indicator span { width: 6px; height: 6px; background: #bbb; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        .message-input-area { padding: 16px 20px; border-top: 1px solid var(--border); background-color: #fff; }
        .file-chip { display: inline-flex; align-items: center; background-color: #f0f7ff; color: var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; margin-bottom: 10px; border: 1px solid #cce5ff; gap: 6px; }
        .file-chip span { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remove-file-btn { background: none; border: none; cursor: pointer; padding: 2px; display: flex; border-radius: 50%; color: var(--primary); opacity: 0.6; transition: opacity 0.2s; }
        .remove-file-btn:hover { opacity: 1; background-color: rgba(0,123,255,0.1); }
        .input-toolbar { display: flex; gap: 10px; align-items: center; }
        .message-form { display: flex; align-items: center; background-color: #fff; border: 1px solid var(--border); border-radius: 24px; padding: 4px 6px 4px 12px; flex-grow: 1; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .message-form:not(.landing-form):focus-within { border-color: var(--primary); box-shadow: 0 2px 8px rgba(0,123,255,0.15); }
        .message-input { flex-grow: 1; border: none; outline: none; padding: 8px 0; font-size: 14.5px; background-color: transparent; color: var(--text-dark); }
        .message-input::placeholder { color: #999; }
        .icon-button { background: none; border: none; cursor: pointer; color: #888; padding: 8px; border-radius: 50%; display: flex; align-items: center; transition: all 0.2s; }
        .icon-button:hover:not(:disabled) { background-color: #f5f5f5; color: var(--text-dark); }
        .send-button { background-color: var(--primary); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; margin-left: 4px; }
        .send-button:hover:not(:disabled) { background-color: #0062cc; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        button:disabled { opacity: 0.5; cursor: not-allowed !important; }
        .error-text { color: #d93025; font-size: 12px; margin-top: 6px; padding-left: 12px; }
        .placeholder-text { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-light); text-align: center; }
        .download-menu { position: absolute; top: 100%; right: 0; margin-top: 6px; background-color: white; border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); z-index: 100; min-width: 130px; overflow: hidden; animation: slideDown 0.15s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .download-menu-header { padding: 8px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #999; background: #fafafa; border-bottom: 1px solid #eee; letter-spacing: 0.5px; }
        .download-menu button { display: block; width: 100%; padding: 8px 12px; background: none; border: none; text-align: left; cursor: pointer; font-size: 13px; color: var(--text-dark); transition: background 0.1s; }
        .download-menu button:hover { background-color: #f5f9ff; color: var(--primary); }
        .display-content { flex-grow: 1; overflow: auto; position: relative; background-color: #fff; display: flex; flex-direction: column; }
        .data-table { width: auto; min-width: 100%; padding:0; margin:20px; border-spacing: 0; font-size: 13px; font-variant-numeric: tabular-nums; }
        .data-table th { padding: 8px 12px; background-color: #fafafa; font-weight: 600; color: #555; text-align: left; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); position: sticky; top: 0; z-index: 10; white-space: nowrap; }
        .data-table td { padding: 0; border-bottom: 1px solid #eee; border-right: 1px solid #eee; background: #fff; }
        .data-table tr:hover td { background-color: #f9f9f9; }
        .table-cell-input { width: 100%; border: none; padding: 8px 12px; font-size: 13px; font-family: inherit; background: transparent; outline: none; box-sizing: border-box; color: var(--text-dark); min-width: 80px; }
        .table-cell-input:focus { box-shadow: inset 0 0 0 1.5px var(--primary); background-color: #fff; z-index: 2; position: relative; }
        .report-view { padding: 30px 40px; max-width: 800px; margin: 0 auto; width: 100%; box-sizing: border-box; }
        .markdown-content { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #24292e; line-height: 1.6; }
        .markdown-content ul, .markdown-content ol { padding-left: 2em; margin-top: 0; margin-bottom: 16px; }
        .markdown-content ul { list-style-type: disc; }
        .markdown-content ol { list-style-type: decimal; }
        .markdown-content ul ul, .markdown-content ol ol { list-style-type: circle; }
        .markdown-content li { margin-top: 0.25em; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; color: #1a1a1a; }
        .markdown-content h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-content h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        .markdown-content h3 { font-size: 1.25em; }
        .markdown-content h4 { font-size: 1em; }
        .markdown-content p { margin-top: 0; margin-bottom: 16px; }
        .markdown-content strong { font-weight: 600; color: #000; }
        .markdown-content li > p { margin-top: 16px; }
        .markdown-content code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(27,31,35,0.05); border-radius: 6px; font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace; }
        .markdown-content pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 6px; margin-bottom: 16px; border: 1px solid #e1e4e8; }
        .markdown-content pre code { background-color: transparent; padding: 0; border: 0; }
        .markdown-content blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; }
        .markdown-content hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; }
        .markdown-content table { border-spacing: 0; border-collapse: collapse; margin-top: 0; margin-bottom: 16px; width: 100%; overflow: auto; display: block; }
        .markdown-content table th, .markdown-content table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
        .markdown-content table th { font-weight: 600; background-color: #f6f8fa; }
        .markdown-content table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
        .markdown-content table tr:nth-child(2n) { background-color: #f8f9fa; }
      `}</style>
    </>
  );
};

export default AiSheets;