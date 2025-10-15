"use client"

import { useEffect, useState } from "react"
import FeedbackTrackingPanel from '../contractManagementV1/feedbackTrackingPanel';

const ContractManagementAiAgentWorkflowDashboard = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8000/api/contracts/all")
        if (!res.ok) throw new Error("Failed to fetch documents")
        const data = await res.json()
        setDocuments((data.results || []).reverse())
      } catch (err) {
        console.error(err)
        alert("Error fetching documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const DocumentCard = ({ document, index }) => {
    return (
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        border: "2px solid #f0f4ff",
        position: "relative"
      }}>
        {/* Document Header */}
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
          {index + 1}
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", marginTop: "10px" }}>
          <span style={{ fontSize: "24px", marginRight: "12px" }}>📄</span>
          <h3 style={{
            color: "#064EE3",
            fontSize: "20px",
            fontWeight: "700",
            margin: 0
          }}>
            Contract Document #{index + 1}
          </h3>
        </div>

        {/* Stakeholders Section */}
        <div>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem"
          }}>
            <span style={{ fontSize: "20px", marginRight: "8px" }}>👥</span>
            <h4 style={{
              color: "#064EE3",
              fontSize: "18px",
              fontWeight: "700",
              margin: 0
            }}>
              Stakeholder Communications ({document.stakeholders?.length || 0})
            </h4>
          </div>

          {document.stakeholders && document.stakeholders.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem"
            }}>
              {document.stakeholders.map((stakeholder, stakeholderIndex) => {
                const statusStyle = getStatusColor(stakeholder.status)
                return (
                  <div key={stakeholderIndex} style={{
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
                        📅 Deadline: {formatDate(stakeholder.deadline)}
                      </div>
                    )}

                    {stakeholder.action_time && (
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "0.75rem" }}>
                        ⏰ Action Time: {formatDate(stakeholder.action_time)}
                      </div>
                    )}

                    <div style={{
                      padding: "0.75rem",
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "0.75rem"
                    }}>
                      {getStatusDisplay(stakeholder.status)}
                    </div>

                    {stakeholder.approval_token && (
                      <div style={{
                        fontSize: "11px",
                        color: "#666",
                        background: "#fff",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #e6f0ff",
                        fontFamily: "monospace",
                        wordBreak: "break-all"
                      }}>
                      </div>
                    )}
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
              No stakeholders found for this document
            </div>
          )}
        </div>
      </div>
    )
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
        <div style={{ marginBottom: "3rem", textAlign: "center", marginTop:"6rem" }}>
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
            Contract Dashboard
          </div>
          <h1 style={{
            fontWeight: 800,
            fontSize: "52px",
            color: "#1a1a1a",
            margin: "0 0 1rem 0",
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          }}>
            All Contract Documents
          </h1>
          <p style={{
            color: "#555",
            fontSize: "20px",
            margin: "0 auto",
            maxWidth: "800px",
            lineHeight: "1.6",
            fontWeight: 400,
          }}>
            View all uploaded contracts and their stakeholder approval status in one centralized dashboard.
          </p>
        </div>

        {/* Navigation Button */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <button
            onClick={() => window.location.href = "/agent-playground/agent/contract-management-v1"}
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
            🚀 Upload New Contract
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "4rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🔄</div>
            <div style={{ fontSize: "18px", color: "#666", fontWeight: 600 }}>
              Loading contract documents...
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "4rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            border: "2px solid #f0f4ff"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📄</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#064EE3", marginBottom: "0.5rem" }}>
              No contracts uploaded yet
            </div>
            <div style={{ fontSize: "16px", color: "#666" }}>
              Upload your first contract to get started with AI-powered analysis.
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              marginBottom: "2rem",
              border: "2px solid #e6f0ff"
            }}>
              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#064EE3",
                textAlign: "center"
              }}>
                📊 Dashboard Summary: {documents.length} Contract{documents.length !== 1 ? 's' : ''} Found
              </div>
            </div>

            {documents.map((doc, idx) => (
              <DocumentCard key={doc._id || idx} document={doc} index={idx} />
            ))}
          </div>
        )}

        {/* Expert Feedback Section */}
        <div style={{ marginTop: "2rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem"
          }}>
            <span style={{ fontSize: "20px", marginRight: "8px" }}>👨‍💼</span>
            <h4 style={{
              color: "#064EE3",
              fontSize: "18px",
              fontWeight: "700",
              margin: 0
            }}>
              Expert Feedback
            </h4>
          </div>

          {/* Display Experts */}
          {document.experts && document.experts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem"
            }}>
              {document.experts.map((expert, idx) => {
                const statusColor = expert.status === "Responded"
                  ? { bg: "#dcfce7", color: "#16a34a" }
                  : { bg: "#fef3c7", color: "#d97706" };

                return (
                  <div key={idx} style={{
                    background: "#f8fbff",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid #e6f0ff"
                  }}>
                    <h5 style={{ margin: "0 0 0.5rem 0", color: "#064EE3" }}>{expert.expert_type}</h5>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "0.5rem" }}>{expert.email}</div>
                    <div style={{
                      padding: "0.5rem 0.75rem",
                      background: statusColor.bg,
                      color: statusColor.color,
                      borderRadius: "50px",
                      display: "inline-block",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {expert.status}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              padding: "1.5rem",
              background: "#f8fbff",
              borderRadius: "12px",
              textAlign: "center",
              color: "#666",
              marginBottom: "2rem",
              border: "1px solid #e6f0ff"
            }}>
              No experts have been assigned to this contract.
            </div>
          )}

          <FeedbackTrackingPanel documentId={document._id} />
        </div>

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            onClick={() => window.location.href = "/agent-playground/agent/contract-management-v1"}
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
            ← Back to Main Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractManagementAiAgentWorkflowDashboard