// Create new file: expertRecommendationPanel.jsx
import React, { useState, useEffect } from "react";

const ExpertRecommendationPanel = ({ contractData, documentId, onExpertsSelected, onBack }) => {
  const [recommendedExperts, setRecommendedExperts] = useState([]);
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [customExpert, setCustomExpert] = useState({ type: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add recommended experts on load
  useEffect(() => {
    if (contractData?.recommended_experts) {
      // Convert recommended experts to selectable format
      const initialExperts = contractData.recommended_experts.map(expert => ({
        ...expert,
        email: "",
        selected: true
      }));
      setRecommendedExperts(contractData.recommended_experts);
      setSelectedExperts(initialExperts);
    }
  }, [contractData]);

  const handleExpertToggle = (index) => {
    const updated = [...selectedExperts];
    updated[index].selected = !updated[index].selected;
    setSelectedExperts(updated);
  };

  const handleEmailChange = (index, email) => {
    const updated = [...selectedExperts];
    updated[index].email = email;
    setSelectedExperts(updated);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleAddCustomExpert = () => {
    if (customExpert.type.trim() === "" || customExpert.email.trim() === "") {
      setError("Please provide both expert type and email");
      return;
    }

    // Validate email format
    if (!validateEmail(customExpert.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSelectedExperts([
      ...selectedExperts,
      {
        expert_type: customExpert.type,
        email: customExpert.email,
        justification: "Custom expert added by user",
        selected: true,
        feedback_token: crypto.randomUUID()
      }
    ]);

    setCustomExpert({ type: "", email: "" });
    setError(null);
  };

  const handleSubmit = async () => {
    // Filter only selected experts with email addresses
    const expertsToSend = selectedExperts.filter(
      expert => expert.selected && expert.email.trim() !== "" && validateEmail(expert.email)
    );

    if (expertsToSend.length === 0) {
      setError("Please select at least one expert and provide their valid email");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`http://localhost:8000/api/contracts/${documentId}/experts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ experts: expertsToSend })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      setSuccess(`Successfully sent email requests to ${result.total_sent} expert(s)`);
      
      if (result.total_failed > 0) {
        setError(`Failed to send emails to ${result.total_failed} expert(s). Please check the emails and try again.`);
      }
      
      setTimeout(() => {
        onExpertsSelected(result);
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Failed to send expert requests");
      console.error("Error sending expert requests:", err);
    } finally {
      setIsSubmitting(false);
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
        4
      </div>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "1.5rem",
        marginTop: "10px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "12px" }}>👨‍💼</span>
        <h3 style={{ 
          color: "#064EE3", 
          fontSize: "20px", 
          fontWeight: "700",
          margin: 0
        }}>
          Expert Recommendations
        </h3>
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
      
      {success && (
        <div style={{
          background: "#dcfce7",
          border: "2px solid #bbf7d0",
          color: "#16a34a",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          <strong>✅ Success:</strong> {success}
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <p>Based on the contract domain and identified risks, we recommend the following experts to review this contract:</p>
      </div>

      {selectedExperts.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          {selectedExperts.map((expert, index) => (
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
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem" 
                }}>
                  <input
                    type="checkbox"
                    checked={expert.selected}
                    onChange={() => handleExpertToggle(index)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <h4 style={{ 
                    color: "#064EE3", 
                    margin: 0, 
                    fontSize: "18px" 
                  }}>
                    {expert.expert_type}
                  </h4>
                </div>
              </div>

              <div style={{ 
                color: "#666", 
                marginBottom: "1rem", 
                fontSize: "14px" 
              }}>
                <strong>Why needed:</strong> {expert.justification}
              </div>
              
              {expert.keywords && expert.keywords.length > 0 && (
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  {expert.keywords.map((keyword, kidx) => (
                    <span key={kidx} style={{
                      background: "#e6f0ff",
                      color: "#064EE3",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "50px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Enter expert's email address"
                  value={expert.email || ""}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  disabled={!expert.selected}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: !expert.email || validateEmail(expert.email) 
                      ? "1px solid #e6f0ff" 
                      : "1px solid #fecaca",
                    background: expert.selected ? "#fff" : "#f0f0f0"
                  }}
                />
                {expert.email && !validateEmail(expert.email) && (
                  <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "0.25rem" }}>
                    Please enter a valid email address
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: "#f8fbff",
          padding: "2rem",
          borderRadius: "12px",
          border: "2px solid #e6f0ff",
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>👨‍💼</div>
          <div style={{ color: "#666" }}>No expert recommendations available. Add a custom expert below.</div>
        </div>
      )}

      <div style={{
        background: "#f8fbff",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "2px solid #e6f0ff",
        marginBottom: "2rem"
      }}>
        <h4 style={{ color: "#064EE3", marginBottom: "1rem" }}>Add Custom Expert</h4>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr auto",
          gap: "1rem",
          alignItems: "end"
        }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              fontSize: "14px", 
              color: "#666" 
            }}>
              Expert Type
            </label>
            <input
              type="text"
              placeholder="Tax Advisor"
              value={customExpert.type}
              onChange={(e) => setCustomExpert({...customExpert, type: e.target.value})}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e6f0ff"
              }}
            />
          </div>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              fontSize: "14px", 
              color: "#666" 
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="expert@example.com"
              value={customExpert.email}
              onChange={(e) => setCustomExpert({...customExpert, email: e.target.value})}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e6f0ff"
              }}
            />
          </div>
          <button
            onClick={handleAddCustomExpert}
            style={{
              padding: "0.75rem 1rem",
              background: "#064EE3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Add Expert
          </button>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          style={{
            padding: "1rem 2rem",
            background: "transparent",
            color: "#064EE3",
            border: "2px solid #064EE3",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          ← Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: "1rem 2rem",
            background: isSubmitting ? "#ccc" : "#064EE3",
            color: "white",
            border: "none",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "Sending Requests..." : "Send Feedback Requests to Selected Experts"}
        </button>
      </div>
    </div>
  );
};

export default ExpertRecommendationPanel;