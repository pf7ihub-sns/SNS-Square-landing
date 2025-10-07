"use client"

import React, { useState, useEffect } from "react"

const ContractManagementAiAgentWorkflow = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [documentId, setDocumentId] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return alert("Please select a contract file first.")
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Call backend API using fetch
      const response = await fetch("http://localhost:8000/api/contract-management-ai", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload contract file')
      }

      const data = await response.json()
      console.log("API Response:", data)

      // Extract actual results from nested structure
      const actualResults = data.results?.results || data.results || data;
      setResult(actualResults);
      setDocumentId(data.results?.document_id || data.document_id || actualResults.document_id);
    } catch (err) {
      console.error("Error uploading contract file:", err)
      alert("Failed to process contract file")
    } finally {
      setLoading(false)
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
          <div style={{ marginBottom: "1rem" }}>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              onChange={handleFileChange}
              style={{
                padding: "0.75rem",
                border: "2px dashed #064EE3",
                borderRadius: "8px",
                background: "#f8fbff",
                marginRight: "1rem"
              }}
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                border: "none",
                background: loading ? "#ccc" : "#064EE3",
                color: "#fff",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              {loading ? "🔄 Processing..." : "🚀 Upload & Process Contract"}
            </button>
          </div>
        </div>

        {/* Debug Information */}
        {result && (
          <div style={{ 
            background: "#f0f9ff", 
            padding: "1rem", 
            borderRadius: "8px", 
            marginBottom: "2rem",
            fontSize: "12px",
            color: "#666"
          }}>
          </div>
        )}

        {/* Agent Workflow Results */}
        {result && (
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

            {/* Agent 1: Contract Analysis */}
            <AgentCard title="Contract Analysis & Extraction" icon="📋" stepNumber="1">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <DataCard label="Domain" value={result.domain} />
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
                      No items found
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
                          </div>
                          <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.5" }}>
                            {item.missing_clause}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#666", fontStyle: "italic", fontSize: "14px" }}>
                      No missing clauses identified
                    </div>
                  )}
                </div>
              </div>
            </AgentCard>

            {/* Agent 3: Clause-Risk Annotations */}
            <AgentCard title="Clause-Risk Mapping & Annotations" icon="🔍" stepNumber="3">
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
              <div style={{ marginBottom: "1rem", fontWeight: "600", color: "#064EE3" }}>
                Stakeholder Communications ({result.stakeholders?.length || 0} contacts):
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