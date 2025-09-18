
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, FileText, Upload, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Something Went Wrong</h2>
          <p className="text-sm">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const API_BASE = "http://127.0.0.1:8000/healthcare_text_classifier_agent";

export default function HealthcareAppointmentClassifier() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // 🔧 Parser for backend response
  function parseResults(rawData) {
    return (Array.isArray(rawData) ? rawData : []).map((item, idx) => {
      let parsed = {};
      try {
        // Remove ```json ... ``` wrapper
        const clean = item.classification.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch (e) {
        console.error("Failed to parse classification JSON:", e);
      }
      return {
        request_id: idx + 1,
        request_text: item.message,
        detected_type: parsed.category || "Unknown",
        urgency_level: parsed.urgency || "N/A",
        assigned_department: parsed.assigned_department || "N/A",
        confidence: parsed.confidence || 70, // fallback
        status: "Pending",
        keywords: parsed.keywords || [],
      };
    });
  }

  // ✅ Manual classify
  async function classifyManual() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post(`${API_BASE}/classify`, {
        messages: [text],
      }, {
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.data || resp.data.error) throw new Error(resp.data.error || "Classification failed");
      setResults(parseResults(resp.data));
    } catch (e) {
      setError(e.message || "Failed to classify text");
    } finally {
      setLoading(false);
    }
  }

  // ✅ File classify
  async function classifyFile(file) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await axios.post(`${API_BASE}/classify_file`, formData);
      if (!resp.data || resp.data.error) throw new Error(resp.data.error || "File classification failed");
      setResults(parseResults(resp.data));
    } catch (e) {
      setError(e.message || "Failed to classify file");
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
      case "urgent":
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
      case "routine":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    if (status?.toLowerCase().includes("completed") || status?.toLowerCase().includes("processed")) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="w-full max-w-5xl mt-22">
          {/* Header */}
          <div className="relative">
            <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              Healthcare Appointment Classifier
            </h1>
            <button
              onClick={() => window.location.href = '/media-entertainment'}
              className="absolute top-4 right-4 flex items-center gap-2 text-white font-medium hover:text-blue-200 transition-colors p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md z-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mb-4 text-gray-700">
            <p className="mb-2">Classify healthcare appointment requests using AI.</p>
            <p className="text-sm">Enter text or upload a file to generate classifications with type, urgency, and department.</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* Manual Classification */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Manual Classification</h2>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Appointment Request Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter appointment request text here...\nExamples:\n• 'Need urgent blood test for diabetes screening'\n• 'Cardiologist consultation for chest pain'\n• 'Routine dental cleaning appointment'"
                />
              </div>
              <button
                onClick={classifyManual}
                disabled={loading || !text.trim()}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
                style={{ backgroundColor: loading || !text.trim() ? '#9CA3AF' : '#1E3A8A' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Classifying...
                  </span>
                ) : (
                  "Classify Request"
                )}
              </button>
            </div>

            {/* Bulk Classification */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Bulk Classification</h2>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload a file with multiple requests</p>
                <label className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all duration-200">
                  <Upload className="w-4 h-4" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) classifyFile(file);
                    }}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">Supports CSV, XLSX, XLS, and JSON files</p>
              </div>
            </div>
          </div>

          {/* Classification Results */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 col-span-full">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Classification Results</h2>
              {results.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </span>
              )}
            </div>
            {results.length === 0 ? (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                Your classification results will appear here
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-medium text-gray-700">ID</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Urgency</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Department</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Confidence</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Keywords</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-700">Request Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, index) => (
                      <tr key={r.request_id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}>
                        <td className="py-4 px-4 font-mono text-xs">{r.request_id}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200">
                            <User className="w-3 h-3" />
                            {r.detected_type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${getUrgencyColor(r.urgency_level)}`}>
                            <AlertCircle className="w-3 h-3" />
                            {r.urgency_level}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-700">{r.assigned_department}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${r.confidence}%` }}></div>
                            </div>
                            <span className="text-xs font-medium">{r.confidence}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(r.status)}
                            <span className="text-xs">{r.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(r.keywords) && r.keywords.slice(0, 3).map((keyword, i) => (
                              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border">
                                {keyword}
                              </span>
                            ))}
                            {Array.isArray(r.keywords) && r.keywords.length > 3 && (
                              <span className="text-xs text-gray-500">+{r.keywords.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <div className="text-xs text-gray-600 leading-relaxed break-words">
                            {r.request_text.length > 100 ? `${r.request_text.substring(0, 100)}...` : r.request_text}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}