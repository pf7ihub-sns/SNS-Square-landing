"use client"

import React, { useState, useEffect } from "react"
import ExpertRecommendationPanel from '../contractManagementV1/expertRecommendationPanel';
import FeedbackTrackingPanel from '../contractManagementV1/feedbackTrackingPanel';

const ContractManagementAiAgentWorkflow = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [documentId, setDocumentId] = useState(null)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showExpertsPanel, setShowExpertsPanel] = useState(false);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [expertsResult, setExpertsResult] = useState(null);

  {result && !result.error && !showExpertsPanel && !showFeedbackPanel && (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <button
        onClick={() => setShowExpertsPanel(true)}
        style={{
          padding: "0.75rem 2rem",
          borderRadius: "50px",
          border: "none",
          background: "#064EE3",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Continue to Expert Recommendations
      </button>
    </div>
  )}
  
  {showExpertsPanel && !showFeedbackPanel && (
    <ExpertRecommendationPanel 
      contractData={result}
      documentId={documentId}
      onExpertsSelected={(expertsResult) => {
        setExpertsResult(expertsResult);
        setShowExpertsPanel(false);
        setShowFeedbackPanel(true);
      }}
      onBack={() => setShowExpertsPanel(false)}
    />
  )}
  
  {showFeedbackPanel && (
    <FeedbackTrackingPanel 
      documentId={documentId}
    />
  )}

  // ==================== EXPORT FUNCTIONS (NEW) ====================
  const exportToJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contract_analysis_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += "Section,Content\n";
    csvContent += `"Domain","${(data.domain || '').replace(/"/g, '""')}"\n`;
    csvContent += `"Summary","${(data.summary || '').replace(/"/g, '""')}"\n`;
    
    if (data.clauses && data.clauses.length > 0) {
      csvContent += "\n\"Clauses\"\n";
      data.clauses.forEach((clause, idx) => {
        csvContent += `"Clause ${idx + 1}","${clause.replace(/"/g, '""')}"\n`;
      });
    }
    
    if (data.obligations && data.obligations.length > 0) {
      csvContent += "\n\"Obligations\"\n";
      data.obligations.forEach((obligation, idx) => {
        csvContent += `"Obligation ${idx + 1}","${obligation.replace(/"/g, '""')}"\n`;
      });
    }
    
    if (data.Risks && data.Risks.length > 0) {
      csvContent += "\n\"Identified Risks\"\n";
      data.Risks.forEach((risk, idx) => {
        csvContent += `"Risk ${idx + 1}","${risk.replace(/"/g, '""')}"\n`;
      });
    }
    
    if (data.missing_clauses && data.missing_clauses.length > 0) {
      csvContent += "\n\"Missing Clauses\"\n";
      data.missing_clauses.forEach((item, idx) => {
        csvContent += `"Risk Index ${item.db_risk_index}","${item.missing_clause.replace(/"/g, '""')}"\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contract_analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async (data) => {
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Contract Analysis Report', margin, yPos);
    yPos += lineHeight * 2;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Domain:', margin, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(data.domain || 'N/A', margin + 25, yPos);
    yPos += lineHeight * 1.5;
    
    doc.setFont(undefined, 'bold');
    doc.text('Summary:', margin, yPos);
    yPos += lineHeight;
    doc.setFont(undefined, 'normal');
    const summaryLines = doc.splitTextToSize(data.summary || 'No summary available', 170);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * lineHeight + lineHeight;
    
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    
    if (data.clauses && data.clauses.length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Clauses:', margin, yPos);
      yPos += lineHeight;
      doc.setFont(undefined, 'normal');
      
      data.clauses.forEach((clause, idx) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        const clauseLines = doc.splitTextToSize(`${idx + 1}. ${clause}`, 170);
        doc.text(clauseLines, margin, yPos);
        yPos += clauseLines.length * lineHeight;
      });
      yPos += lineHeight;
    }
    
    if (data.missing_clauses && data.missing_clauses.length > 0) {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFont(undefined, 'bold');
      doc.text('Missing Clauses:', margin, yPos);
      yPos += lineHeight;
      doc.setFont(undefined, 'normal');
      
      data.missing_clauses.forEach((item, idx) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        const clauseLines = doc.splitTextToSize(`Risk Index ${item.db_risk_index}: ${item.missing_clause}`, 170);
        doc.text(clauseLines, margin, yPos);
        yPos += clauseLines.length * lineHeight + 3;
      });
    }
    
    doc.save(`contract_analysis_${Date.now()}.pdf`);
  };
  // ==================== END EXPORT FUNCTIONS ====================

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      
      // Client-side validation (NEW)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        setError("File is too large. Maximum size is 50MB.");
        return;
      }
      
      const allowedTypes = ['.pdf', '.docx', '.txt'];
      const fileExt = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      if (!allowedTypes.includes(fileExt)) {
        setError(`Invalid file type. Only PDF, DOCX, and TXT files are supported.`);
        return;
      }
      
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a contract file first.");
      return;
    }
    
    setLoading(true)
    setResult(null)
    setError(null)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append("file", file)

      setUploadProgress(30)

      // Call backend API using fetch with timeout (UPDATED)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch("http://localhost:8000/api/contract-management-ai", {
        method: "POST",
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId);
      setUploadProgress(70)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json()
      console.log("API Response:", data)

      setUploadProgress(90)

      // Extract actual results from nested structure
      const actualResults = data.results?.results || data.results || data;
      
      // Check for errors in the response (NEW)
      if (actualResults.error) {
        throw new Error(actualResults.error);
      }
      
      // Validate that we got meaningful results (NEW)
      if (!actualResults.domain && !actualResults.clauses) {
        throw new Error("No contract information could be extracted. Please ensure the document is a valid contract.");
      }
      
      setResult(actualResults);
      setDocumentId(data.results?.document_id || data.document_id || actualResults.document_id);
      setUploadProgress(100)

    } catch (err) {
      console.error("Error uploading contract file:", err)
      
      if (err.name === 'AbortError') {
        setError("Request timed out. The document may be too large or the server is busy. Please try again.");
      } else {
        setError(err.message || "Failed to process contract file. Please check the document and try again.");
      }
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Poll for status updates
  useEffect(() => {
    if (!documentId) return
    
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/contracts/status/${documentId}`)
        if (res.ok) {
          const data = await res.json()
          setResult((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              stakeholders: data.stakeholders || data.results?.stakeholders || prev.stakeholders || [],
            };
          });
        }
      } catch (err) {
        console.error("Error fetching status:", err)
        // Don't show error to user for polling failures
      }
    }
    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [documentId])

  const AgentCard = ({ title, icon, children, stepNumber }) => (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "2rem",
      marginBottom: "2rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      border: "2px solid #f0f4ff",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        top: "-15px",
        left: "30px",
        background: "#064EE3",
        color: "white",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "18px"
      }}>
        {stepNumber}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", marginTop: "10px" }}>
        <span style={{ fontSize: "24px", marginRight: "12px" }}>{icon}</span>
        <h3 style={{ 
          color: "#064EE3", 
          fontSize: "20px", 
          fontWeight: "700",
          margin: 0
        }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )

  const DataCard = ({ label, value, type = "text" }) => (
    <div style={{
      background: "#f8fbff",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      border: "1px solid #e6f0ff"
    }}>
      <div style={{ fontWeight: "600", color: "#064EE3", marginBottom: "0.5rem" }}>
        {label}:
      </div>
      <div style={{ 
        color: "#333",
        wordBreak: type === "description" ? "break-word" : "normal",
        lineHeight: type === "description" ? "1.6" : "1.4"
      }}>
        {value || "Not available"}
      </div>
    </div>
  )

  const ListCard = ({ items, title, emptyMessage = "No items found" }) => (
    <div style={{
      background: "#f8fbff",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      border: "1px solid #e6f0ff"
    }}>
      <div style={{ fontWeight: "600", color: "#064EE3", marginBottom: "1rem" }}>
        {title} ({items?.length || 0}):
      </div>
      {items && items.length > 0 ? (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {items.map((item, index) => (
            <div key={index} style={{
              background: "white",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #e6f0ff",
              fontSize: "14px",
              color: "#333"
            }}>
              • {typeof item === 'string' ? item : item.missing_clause || JSON.stringify(item)}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#666", fontStyle: "italic", fontSize: "14px" }}>
          {emptyMessage}
        </div>
      )}
    </div>
  )

  const getRiskFlagColor = (flag) => {
    switch(flag) {
      case "Present": return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" }
      case "Missing": return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" }
      default: return { bg: "#f8fbff", color: "#666", border: "#e6f0ff" }
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "approved":
        return { bg: "#dcfce7", color: "#16a34a" }
      case "rejected":
        return { bg: "#fef2f2", color: "#dc2626" }
      case "pending":
      default:
        return { bg: "#fef3c7", color: "#d97706" }
    }
  }

  const getStatusDisplay = (status) => {
    switch(status?.toLowerCase()) {
      case "approved":
        return "✅ Approved"
      case "rejected":
        return "❌ Rejected"
      case "pending":
        return "⏳ Pending Approval"
      default:
        return status || "⏳ Pending Approval"
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%)",
      padding: "3rem 2rem",
      fontFamily: "Manrope, system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginTop:"6rem",marginBottom: "3rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "#064EE3",
            color: "white",
            padding: "0.75rem 2rem",
            borderRadius: "50px",
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "2rem",
            letterSpacing: "0.5px",
          }}>
            AI Workflow
          </div>
          <h1 style={{
            fontWeight: 800,
            fontSize: "52px",
            color: "#1a1a1a",
            margin: "0 0 1rem 0",
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          }}>
            Contract Management AI Agent Workflow
          </h1>
          <p style={{
            color: "#555",
            fontSize: "20px",
            margin: "0 auto",
            maxWidth: "800px",
            lineHeight: "1.6",
            fontWeight: 400,
          }}>
            Upload a contract file and see the AI agent workflow execute step-by-step for analysis and processing.
          </p>
          <div style={{ textAlign: "center", marginBottom: "2rem", marginTop:"6rem"}}>
            <button
              onClick={() => window.location.href = "/agent-playground/agent/contract-management-v1/dashboard"}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                border: "none",
                background: "#064EE3",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "1rem"
              }}
            >
              📂 See All Documents
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div style={{
          marginBottom: "3rem",
          marginTop:"6rem",
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#064EE3", marginBottom: "1.5rem" }}>
            📄 Upload Contract File
          </h2>
          
          {/* Error Display (NEW) */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "2px solid #fecaca",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "left"
            }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}
          
          {/* Warning Display (NEW) */}
          {result?.warning && (
            <div style={{
              background: "#fef3c7",
              border: "2px solid #fde68a",
              color: "#d97706",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "left"
            }}>
              <strong>⚠️ Warning:</strong> {result.warning}
            </div>
          )}
          
          <div style={{ marginBottom: "1rem" }}>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              onChange={handleFileChange}
              disabled={loading}
              style={{
                padding: "0.75rem",
                border: "2px dashed #064EE3",
                borderRadius: "8px",
                background: "#f8fbff",
                marginRight: "1rem",
                opacity: loading ? 0.5 : 1
              }}
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                border: "none",
                background: (loading || !file) ? "#ccc" : "#064EE3",
                color: "#fff",
                fontWeight: 600,
                cursor: (loading || !file) ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              {loading ? "🔄 Processing..." : "🚀 Upload & Process Contract"}
            </button>
          </div>
          
          {/* Progress Bar (NEW) */}
          {loading && (
            <div style={{
              width: "100%",
              height: "8px",
              background: "#e6f0ff",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "1rem"
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#064EE3",
                transition: "width 0.3s ease"
              }}></div>
            </div>
          )}
          
          {file && !loading && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "#dcfce7",
              borderRadius: "8px",
              color: "#16a34a",
              fontSize: "14px"
            }}>
              ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Agent Workflow Results */}
        {result && !result.error && (
          <div>
            <h2 style={{ 
              fontSize: "32px", 
              fontWeight: 800, 
              color: "#1a1a1a", 
              marginBottom: "2rem",
              textAlign: "center"
            }}>
              🤖 AI Agent Workflow Results
            </h2>

            {/* ==================== EXPORT SECTION (NEW) ==================== */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              border: "2px solid #f0f4ff",
              textAlign: "center"
            }}>
              <h3 style={{ color: "#064EE3", marginBottom: "1rem" }}>📥 Export Results</h3>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => exportToJSON(result)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#10B981",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  📄 Export as JSON
                </button>
                <button
                  onClick={() => exportToCSV(result)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#3B82F6",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  📊 Export as CSV
                </button>
                <button
                  onClick={() => exportToPDF(result)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#EF4444",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  📑 Export as PDF
                </button>
              </div>
            </div>
            {/* ==================== END EXPORT SECTION ==================== */}

            {/* Agent 1: Contract Analysis */}
            <AgentCard title="Contract Analysis & Extraction" icon="📋" stepNumber="1">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <DataCard label="Domain" value={result.domain} />
                {result.confidence && (
                  <DataCard label="Confidence Level" value={result.confidence.toUpperCase()} />
                )}
                <div style={{ gridColumn: "1 / -1" }}>
                  <DataCard label="Contract Summary" value={result.summary} type="description" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <ListCard items={result.clauses} title="Contract Clauses" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <ListCard items={result.obligations} title="Key Obligations" />
                </div>
              </div>
            </AgentCard>

            {/* Agent 2: Risk Assessment */}
            <AgentCard title={`Risk Assessment & Gap Analysis - ${result.domain || "Contract"}`} icon="⚠️" stepNumber="2">
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: "600", color: "#064EE3", marginBottom: "1rem" }}>
                    Identified Risks ({result.Risks?.length || 0}):
                  </div>
                  {result.Risks && result.Risks.length > 0 ? (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      {result.Risks.map((risk, idx) => (
                        <div key={idx} style={{
                          background: "white",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #e6f0ff",
                          fontSize: "14px",
                          color: "#333"
                        }}>
                          {`${idx + 1}. ${risk}`}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#666", fontStyle: "italic", fontSize: "14px" }}>
                      No predefined risks for this domain
                    </div>
                  )}
                </div>
                
                <div style={{
                  background: "#f8fbff",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #e6f0ff"
                }}>
                  <div style={{ fontWeight: "600", color: "#064EE3", marginBottom: "1rem" }}>
                    Missing Clauses ({result.missing_clauses?.length || 0}):
                  </div>
                  {result.missing_clauses && result.missing_clauses.length > 0 ? (
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {result.missing_clauses.map((item, index) => (
                        <div key={index} style={{
                          background: "#fef2f2",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #fecaca"
                        }}>
                          <div style={{ fontWeight: "600", color: "#dc2626", marginBottom: "0.5rem" }}>
                            Risk Index: {item.db_risk_index}
                            {item.risk_category && ` - ${item.risk_category}`}
                          </div>
                          <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.5" }}>
                            {item.missing_clause}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#16a34a", fontStyle: "italic", fontSize: "14px" }}>
                      ✓ No missing clauses identified - Contract appears complete
                    </div>
                  )}
                </div>
              </div>
            </AgentCard>

            {/* Agent 3: Clause-Risk Annotations */}
            <AgentCard title="Clause-Risk Mapping & Annotations" icon="📊" stepNumber="3">
              <div style={{
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #e6f0ff",
                borderRadius: "8px"
              }}>
                <div style={{ padding: "1rem", fontWeight: "600", color: "#064EE3", borderBottom: "2px solid #e6f0ff", background: "#f8fbff", position: "sticky", top: 0 }}>
                  Clause Annotations ({result.annotations?.length || 0} items):
                </div>
                {result.annotations && result.annotations.length > 0 ? (
                  <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
                    {result.annotations.map((annotation, index) => {
                      const flagStyle = getRiskFlagColor(annotation.risk_flag)
                      return (
                        <div key={index} style={{
                          background: "white",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #e6f0ff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                            <div style={{ fontWeight: "600", color: "#064EE3", flex: 1, marginRight: "1rem" }}>
                              {annotation.clause}
                            </div>
                            <div style={{
                              background: flagStyle.bg,
                              color: flagStyle.color,
                              border: `1px solid ${flagStyle.border}`,
                              padding: "0.25rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600",
                              whiteSpace: "nowrap"
                            }}>
                              {annotation.risk_flag}
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", color: "#666", marginBottom: "0.5rem" }}>
                            Risk Index: {annotation.db_risk_index || "N/A"}
                            {annotation.confidence && ` • Confidence: ${annotation.confidence}`}
                          </div>
                          <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.5" }}>
                            {annotation.explanation}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#666", fontStyle: "italic" }}>
                    No annotations available
                  </div>
                )}
              </div>
            </AgentCard>

            {/* Agent 4: Stakeholder Notifications */}
            <AgentCard title="Stakeholder Notification Dashboard" icon="👥" stepNumber="4">
              {result.email_warnings && (
                <div style={{
                  background: "#fef3c7",
                  border: "2px solid #fde68a",
                  color: "#d97706",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <strong>⚠️ Email Delivery Issues:</strong>
                  <ul style={{ margin: "0.5rem 0 0 1.5rem" }}>
                    {result.email_warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div style={{ marginBottom: "1rem", fontWeight: "600", color: "#064EE3" }}>
                Stakeholder Communications ({result.stakeholders?.length || 0} contacts)
                {result.emails_sent !== undefined && ` - ${result.emails_sent} emails sent`}
              </div>
              {result.stakeholders && result.stakeholders.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1rem"
                }}>
                  {result.stakeholders.map((stakeholder, index) => {
                    const statusStyle = getStatusColor(stakeholder.status)
                    return (
                      <div key={index} style={{
                        background: "#f8fbff",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "2px solid #e6f0ff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                          <div style={{
                            background: "#064EE3",
                            color: "white",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginRight: "1rem"
                          }}>
                            {stakeholder.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", color: "#064EE3", fontSize: "16px" }}>
                              {stakeholder.name}
                            </div>
                            <div style={{ color: "#666", fontSize: "12px" }}>
                              {stakeholder.position}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: "14px", color: "#333", marginBottom: "0.75rem" }}>
                          📧 {stakeholder.email}
                        </div>
                        {stakeholder.deadline && (
                          <div style={{ fontSize: "12px", color: "#666", marginBottom: "0.75rem" }}>
                            Deadline: {formatDate(stakeholder.deadline)}
                          </div>
                        )}
                        <div style={{
                          padding: "0.75rem",
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}>
                          {getStatusDisplay(stakeholder.status)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: "center",
                  color: "#666",
                  fontStyle: "italic",
                  padding: "2rem",
                  background: "#f8fbff",
                  borderRadius: "8px",
                  border: "1px solid #e6f0ff"
                }}>
                  No stakeholders found for notification
                </div>
              )}
            </AgentCard>
          </div>
        )}

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: "transparent",
              color: "#064EE3",
              border: "2px solid #064EE3",
              borderRadius: "50px",
              padding: "1rem 2.5rem",
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#064EE3"
              e.target.style.color = "white"
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent"
              e.target.style.color = "#064EE3"
            }}
          >
            ← Back to Agent
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractManagementAiAgentWorkflow