// Create new file: FeedbackTrackingPanel.jsx
import React, { useEffect, useState } from 'react';

const FeedbackTrackingPanel = ({ documentId }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/contracts/${documentId}/feedback`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (documentId) {
      fetchFeedback();
      
      // Set up polling interval
      const interval = setInterval(fetchFeedback, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [documentId]);
  
  const getSentimentIcon = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return '👍';
      case 'negative': return '👎';
      case 'neutral': return '😐';
      case 'mixed': return '🤔';
      default: return '❓';
    }
  };
  
  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return { bg: '#dcfce7', color: '#16a34a' };
      case 'negative': return { bg: '#fef2f2', color: '#dc2626' };
      case 'neutral': return { bg: '#f8fafc', color: '#64748b' };
      case 'mixed': return { bg: '#fef3c7', color: '#d97706' };
      default: return { bg: '#f8fafc', color: '#64748b' };
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };
  
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
        5
      </div>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", marginTop: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "24px", marginRight: "12px" }}>📊</span>
          <h3 style={{ 
            color: "#064EE3", 
            fontSize: "20px", 
            fontWeight: "700",
            margin: 0
          }}>
            Expert Feedback Tracking
          </h3>
        </div>
        
        <button
          onClick={fetchFeedback}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: loading ? "#ccc" : "#064EE3",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px"
          }}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      
      {error && (
        <div style={{
          background: "#fef2f2",
          border: "2px solid #fecaca",
          color: "#dc2626",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
      
      {feedback.length > 0 ? (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {feedback.map((item, index) => {
            const sentimentStyle = getSentimentColor(item.sentiment);
            return (
              <div key={index} style={{
                background: "#f8fbff",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "2px solid #e6f0ff"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}>
                  <div>
                    <h4 style={{ 
                      color: "#064EE3", 
                      margin: "0 0 0.25rem 0", 
                      fontSize: "18px" 
                    }}>
                      {item.expert_type} ({item.expert_email})
                    </h4>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Received: {formatDate(item.feedback_date)}
                    </div>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    background: sentimentStyle.bg,
                    color: sentimentStyle.color,
                    borderRadius: "50px",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    <span style={{ marginRight: "0.5rem" }}>
                      {getSentimentIcon(item.sentiment)}
                    </span>
                    {item.sentiment}
                  </div>
                </div>
                
                {item.key_points && item.key_points.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <h5 style={{ color: "#064EE3", fontSize: "16px" }}>Key Points:</h5>
                    <ul style={{ 
                      margin: "0.5rem 0", 
                      paddingLeft: "1.5rem",
                      color: "#333"
                    }}>
                      {item.key_points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.suggested_changes && item.suggested_changes.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <h5 style={{ 
                      color: "#064EE3", 
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <span>📝</span> Suggested Changes:
                    </h5>
                    <ul style={{ 
                      margin: "0.5rem 0", 
                      paddingLeft: "1.5rem",
                      color: "#333"
                    }}>
                      {item.suggested_changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.concerns && item.concerns.length > 0 && (
                  <div style={{ 
                    background: "#fef2f2",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #fecaca"
                  }}>
                    <h5 style={{ 
                      color: "#dc2626", 
                      fontSize: "16px",
                      margin: "0 0 0.5rem 0"
                    }}>
                      Issues & Concerns:
                    </h5>
                    <ul style={{ 
                      margin: "0", 
                      paddingLeft: "1.5rem",
                      color: "#333"
                    }}>
                      {item.concerns.map((concern, i) => (
                        <li key={i}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          background: "#f8fbff",
          padding: "3rem 1.5rem",
          borderRadius: "12px",
          textAlign: "center",
          color: "#666",
          border: "2px solid #e6f0ff"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📭</div>
          <h4 style={{ color: "#064EE3", marginBottom: "0.5rem" }}>No Feedback Received Yet</h4>
          <p>Expert feedback will appear here once received. Check back later or refresh.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackTrackingPanel;