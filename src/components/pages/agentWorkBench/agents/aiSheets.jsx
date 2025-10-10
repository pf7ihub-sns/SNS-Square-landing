import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import { Paperclip, Download, Send, X, File as FileIcon, RotateCcw } from 'lucide-react';
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
  const chartRef = useRef(null);

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
  }, [visualization]);

  // FIXED: This function now reads the file and sends its content to the /save-data endpoint
  const uploadFileToBackend = async (fileToUpload) => {
    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert the entire sheet to a JSON array (list of lists)
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
          throw new Error(errorData.message || 'Backend failed to process the uploaded file.');
        }

        console.log('File successfully uploaded and saved by backend.');

      } catch (err) {
        console.error('File upload error:', err);
        setError(`Failed to upload file: ${err.message}`);
        setFile(null);
        setDataPreview([]);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = (err) => {
        setError('Failed to read the file.');
        setLoading(false);
        console.error('FileReader error:', err);
    };

    reader.readAsArrayBuffer(fileToUpload);
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.tsv'))) {
      setFile(selectedFile);
      setConversation([]);
      setError('');
      setResponse('');
      setVisualization(null);
      setActiveView('preview');

      // 1. Read file for frontend preview (unchanged)
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setDataPreview(jsonData.slice(0, 51));
      };
      reader.readAsArrayBuffer(selectedFile);

      // 2. Automatically upload to backend using the corrected function
      await uploadFileToBackend(selectedFile);

    } else {
      setError('Please upload a CSV, XLSX, or TSV file.');
    }
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
      console.error('Error removing file:', err);
      setError('Failed to remove file from backend.');
    }
  };
  
  const handleCellEdit = (rowIdx, colIdx, value) => {
    const updatedData = [...dataPreview];
    updatedData[rowIdx + 1][colIdx] = value;
    setDataPreview(updatedData);
  };

  const handleSaveData = async () => {
    if (!file || !dataPreview.length) {
      setError('No data to save.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      // When saving edits, we only need to send the data from the preview table
      formData.append('data', JSON.stringify(dataPreview));
      formData.append('filename', file.name);

      const res = await fetch('http://localhost:8000/ai-sheets/save-data', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save edited data');
      const result = await res.json();
      alert(result.message || 'Data saved successfully!');
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
    setVisualization(null);
    setQuery('');
    setActiveView('preview');
    setError('');
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!file || !query.trim()) return;
    setLoading(true);
    setError('');
    const newConversation = [...conversation, { user: query, ai: '' }];
    setConversation(newConversation);
    const formData = new FormData();
    formData.append('query', query);
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
            updated[updated.length - 1].ai = "Certainly! I've generated the report, which you can view on the right.";
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
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your query.');
      setConversation(prev => prev.slice(0, -1));
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
        // A slightly improved template for printing
        printWindow.document.write(`
            <html>
                <head>
                    <title>${filename}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; line-height: 1.6; }
                        pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: inherit; }
                    </style>
                </head>
                <body><pre>${reportContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body>
            </html>
        `);
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


  const renderActiveView = () => {
    if (!file) return <div className="placeholder-text">Upload a dataset to begin.</div>;
    switch (activeView) {
      case 'report':
        return <div className="markdown-content"><ReactMarkdown>{response}</ReactMarkdown></div>;
      case 'visualization':
        return (
          <div>
            <canvas ref={chartRef} id="myChart" style={{ maxHeight: '500px', width: '100%' }}></canvas>
            {visualization?.explanation && <p className="explanation-text">{visualization.explanation}</p>}
          </div>
        );
      case 'preview':
      default:
        return (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>{dataPreview[0]?.map((header, colIdx) => <th key={colIdx}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {dataPreview.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td key={colIdx}>
                        <input
                          type="text"
                          value={cell ?? ''}
                          onChange={(e) => handleCellEdit(rowIdx, colIdx, e.target.value)}
                          className="table-cell-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="ai-sheets-container">
      <div className="chat-panel">
        <div className="chat-header"><h2>AI Sheets</h2></div>
        <div className="conversation-area">
          {conversation.length === 0 ? (
            <div className="placeholder-text"><p>To give you the most helpful and relevant information, please upload a dataset and ask a question.</p></div>
          ) : (
            conversation.map((msg, idx) => (
              <div key={idx} className="conversation-turn">
                <div className="user-message-bubble">{msg.user}</div>
                {msg.ai && <div className="ai-response-area markdown-content"><ReactMarkdown>{msg.ai}</ReactMarkdown></div>}
              </div>
            ))
          )}
          {loading && <div className="loader">Processing...</div>}
        </div>
        <div className="message-input-area">
          {file && (
            <div className="file-chip">
              <FileIcon size={16} /><span>{file.name}</span>
              <button onClick={handleRemoveFile} className="remove-file-btn"><X size={16} /></button>
            </div>
          )}
          <div className="input-toolbar">
            <form onSubmit={handleQuerySubmit} className="message-form">
              <button type="button" onClick={() => fileInputRef.current.click()} className="icon-button" title="Upload File"><Paperclip size={20} /></button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx,.tsv" style={{ display: 'none' }} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Message" className="message-input" disabled={loading || !file} />
              <button type="submit" className="send-button" disabled={loading || !query.trim() || !file}><Send size={20} /></button>
            </form>
            <button onClick={clearConversation} className="icon-button" title="Clear Conversation" disabled={conversation.length === 0 && !response}><RotateCcw size={20}/></button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
      <div className="display-panel">
        <div className="display-header">
          <h3 className="display-title">{file ? `Analysis of ${file.name}` : 'Data Display'}</h3>
          <div className="display-controls">
            <button onClick={handleSaveData} className="view-button" disabled={loading || !file || !dataPreview.length} >Save Edits</button>
            {response && <button className={`view-button ${activeView === 'report' ? 'active' : ''}`} onClick={() => setActiveView('report')}>View Report</button>}
            {dataPreview.length > 0 && <button className={`view-button ${activeView === 'preview' ? 'active' : ''}`} onClick={() => setActiveView('preview')}>View Data</button>}
            <div style={{ position: 'relative' }}>
              <button onClick={() => activeView === 'preview' ? setShowDataDownloadMenu(p => !p) : setShowReportDownloadMenu(p => !p)} className="icon-button" title="Download"><Download size={20} /></button>
              {showDataDownloadMenu && activeView === 'preview' && (
                <div className="download-menu">
                  <div className="download-menu-header">Export as</div>
                  <button onClick={() => handleDownloadData('csv')}>CSV</button>
                  <button onClick={() => handleDownloadData('excel')}>Excel</button>
                </div>
              )}
              {showReportDownloadMenu && (activeView === 'report' || activeView === 'visualization') && (
                <div className="download-menu">
                  <div className="download-menu-header">Export as</div>
                  <button onClick={() => handleDownloadReport('pdf')}>PDF Document</button>
                  <button onClick={() => handleDownloadReport('docx')}>Word Document</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="display-content">{renderActiveView()}</div>
      </div>
      <style>{`
        /* All existing styles remain the same */
        .ai-sheets-container { display: flex; gap: 20px; padding: 20px; margin-top:100px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f7f8fc; height: 85vh; box-sizing: border-box; }
        .chat-panel, .display-panel { flex: 1; display: flex; flex-direction: column; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .chat-header { padding: 12px 20px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0; }
        .chat-header h2 { margin: 0; font-size: 18px; }
        .conversation-area { flex-grow: 1; overflow-y: auto; padding: 20px; }
        .conversation-turn { margin-bottom: 24px; }
        .user-message-bubble { background-color: #007bff; color: white; padding: 12px 18px; border-radius: 18px; display: inline-block; max-width: 80%; font-size: 15px; }
        .ai-response-area { margin-top: 12px; font-size: 15px; line-height: 1.6; color: #333; }
        .loader { text-align: center; color: #888; padding: 10px; }
        .message-input-area { padding: 15px; border-top: 1px solid #e0e0e0; background-color: #f9f9f9; }
        .file-chip { display: flex; align-items: center; background-color: #e9ecef; padding: 6px 12px; border-radius: 16px; font-size: 14px; margin-bottom: 10px; }
        .file-chip span { margin-right: auto; padding-left: 8px; }
        .remove-file-btn { background: none; border: none; cursor: pointer; padding: 2px; display: flex; border-radius: 50%; }
        .remove-file-btn:hover { background-color: #ced4da; }
        .input-toolbar { display: flex; gap: 8px; align-items: center; }
        .message-form { display: flex; align-items: center; gap: 10px; background-color: #fff; border: 1px solid #ccc; border-radius: 25px; padding: 5px; flex-grow: 1; }
        .message-input { flex-grow: 1; border: none; outline: none; padding: 8px; font-size: 15px; background-color: transparent; }
        .icon-button, .send-button { background: none; border: none; cursor: pointer; color: #555; padding: 8px; border-radius: 50%; display: flex; align-items: center; }
        .icon-button:hover, .send-button:hover { background-color: #f0f0f0; }
        .icon-button:disabled { cursor: not-allowed; color: #bbb; }
        .send-button { background-color: #007bff; color: white; }
        .send-button:disabled, .view-button:disabled { background-color: #a0cfff; cursor: not-allowed; opacity: 0.6; }
        .error-text { color: red; text-align: center; font-size: 14px; margin-top: 10px; }
        .display-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid #e0e0e0; flex-shrink: 0; }
        .display-title { margin: 0; font-size: 16px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .display-controls { display: flex; align-items: center; gap: 10px; }
        .view-button { background-color: #f0f2f5; border: 1px solid #dcdcdc; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .view-button.active { background-color: #e7f1ff; border-color: #007bff; color: #007bff; font-weight: 500; }
        .download-menu { position: absolute; top: calc(100% + 5px); right: 0; background-color: white; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10; width: 180px; }
        .download-menu-header { padding: 8px 12px; font-size: 14px; font-weight: 500; color: #555; border-bottom: 1px solid #eee; }
        .download-menu button { display: block; width: 100%; padding: 10px 12px; background: none; border: none; text-align: left; cursor: pointer; font-size: 14px; }
        .download-menu button:hover { background-color: #f5f5f5; }
        .display-content { flex-grow: 1; overflow: auto; padding: 20px; }
        .placeholder-text { text-align: center; color: #888; margin-top: 40px; padding: 0 20px; }
        .explanation-text { line-height: 1.7; font-size: 15px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .data-table th, .data-table td { padding: 0; border: 1px solid #ddd; text-align: left; white-space: nowrap; }
        .data-table th { padding: 12px 15px; background-color: #f7f8fc; font-weight: 600; position: sticky; top: -20px; }
        .table-cell-input { width: 100%; height: 100%; border: none; background-color: transparent; padding: 12px 15px; font-size: 14px; outline: none; }
        .table-cell-input:focus { background-color: #e7f1ff; }
        .markdown-content { line-height: 1.7; font-size: 15px; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; }
        .markdown-content p { margin-bottom: 16px; }
        .markdown-content ul, .markdown-content ol { padding-left: 24px; margin-bottom: 16px; }
        .markdown-content li { margin-bottom: 8px; }
        .markdown-content pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        .markdown-content code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 85%; background-color: rgba(27,31,35,0.05); border-radius: 3px; padding: 0.2em 0.4em; }
        .markdown-content pre > code { background-color: transparent; padding: 0; }
        .markdown-content blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin-left: 0; }
      `}</style>
    </div>
  );
};

export default AiSheets;