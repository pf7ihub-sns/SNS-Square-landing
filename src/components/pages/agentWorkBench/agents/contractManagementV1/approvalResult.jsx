import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { saveAs } from 'file-saver';

export default function ApprovalResult() {
  const query = new URLSearchParams(useLocation().search);
  const decision = query.get("decision");
  const email = query.get("email");
  const documentId = query.get("document_id");
  const timestamp = new Date().toLocaleString();

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Contract Approval Report', 105, 20, { align: 'center' });
    
    // Add decision
    doc.setFontSize(14);
    doc.text(`Status: ${decision === "APPROVED" ? "✅ Approved" : "❌ Rejected"}`, 14, 40);
    doc.text(`Stakeholder: ${email}`, 14, 50);
    doc.text(`Document ID: ${documentId || 'N/A'}`, 14, 60);
    doc.text(`Decision Time: ${timestamp}`, 14, 70);
    
    // Add a simple line
    doc.line(14, 80, 196, 80);
    
    // Add some space and a note
    doc.setFontSize(12);
    doc.text('This is an automatically generated report of the contract decision.', 14, 90);
    
    // Save the PDF
    doc.save(`contract_approval_${documentId || 'report'}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ['Field', 'Value'];
    
    const data = [
      ['Status', decision === "APPROVED" ? 'Approved' : 'Rejected'],
      ['Stakeholder', email],
      ['Document ID', documentId || 'N/A'],
      ['Decision Time', timestamp]
    ];
    
    let csvContent = 'data:text/csv;charset=utf-8,' 
      + headers.join(',') + '\n' 
      + data.map(row => 
          row.map(field => `"${field}"`).join(',')
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contract_approval_${documentId || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%)",
      padding: "3rem 2rem",
      fontFamily: "Manrope, system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        {/* Header Badge */}
        <div style={{
          display: "inline-block",
          background: "#064EE3",
          color: "white",
          padding: "0.75rem 2rem",
          borderRadius: "50px",
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "2rem",
          letterSpacing: "0.5px",
        }}>
          Contract Decision
        </div>

        {/* Main Result Card */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem 2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "2px solid #f0f4ff",
          marginBottom: "2rem"
        }}>
          {decision === "APPROVED" ? (
            <>
              <div style={{ fontSize: "64px", marginBottom: "1rem" }}>✅</div>
              <h1 style={{
                fontWeight: 800,
                fontSize: "36px",
                color: "#16a34a",
                margin: "0 0 1rem 0",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
              }}>
                Contract Approved
              </h1>
              <div style={{
                padding: "1rem",
                background: "#dcfce7",
                color: "#16a34a",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "1.5rem",
                border: "2px solid #bbf7d0"
              }}>
                🎉 Approval Confirmed
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "64px", marginBottom: "1rem" }}>❌</div>
              <h1 style={{
                fontWeight: 800,
                fontSize: "36px",
                color: "#dc2626",
                margin: "0 0 1rem 0",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
              }}>
                Contract Rejected
              </h1>
              <div style={{
                padding: "1rem",
                background: "#fef2f2",
                color: "#dc2626",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "1.5rem",
                border: "2px solid #fecaca"
              }}>
                ⚠️ Decision Recorded
              </div>
            </>
          )}

          <div style={{
            background: "#f8fbff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "2px solid #e6f0ff",
            marginBottom: "2rem"
          }}>
            <p style={{
              color: "#555",
              fontSize: "18px",
              margin: "0",
              lineHeight: "1.6",
              fontWeight: 400,
            }}>
              Thank you, <strong style={{ color: "#064EE3" }}>{email}</strong>.
              <br />
              Your decision has been successfully recorded in our system.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <a
              href="/agent-playground/agent/contract-management-v1"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                borderRadius: "50px",
                border: "none",
                background: "#064EE3",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "16px",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(6, 78, 227, 0.3)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#0536b8";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(6, 78, 227, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#064EE3";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(6, 78, 227, 0.3)";
              }}
            >
              Back
            </a>
          </div>
        </div>

        {/* Additional Info Card */}
        <div style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "2px solid #e6f0ff"
        }}>
          <div style={{ 
            fontSize: "16px", 
            fontWeight: 600, 
            color: "#064EE3",
            marginBottom: "0.5rem"
          }}>
            📊 Decision Summary
          </div>
          <div style={{ 
            fontSize: "14px", 
            color: "#666",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <span>Stakeholder: {email}</span>
            <span>Status: {decision === "APPROVED" ? "✅ Approved" : "❌ Rejected"}</span>
            <span>Time: {new Date().toLocaleString()}</span>
          </div>

          {/* Export Section */}
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem',
            borderTop: '1px solid #eee'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '1rem',
              fontWeight: 600
            }}>Export Report</h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={exportToPDF}
                style={{
                  background: '#064EE3',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0536b8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#064EE3';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>📄</span> Export as PDF
              </button>
              
              <button 
                onClick={exportToCSV}
                style={{
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0D9F6E';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#10B981';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>📊</span> Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}