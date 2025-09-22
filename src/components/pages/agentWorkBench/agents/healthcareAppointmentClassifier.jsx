import React, { useState } from "react";
import {
  Upload,
  FileText,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Stethoscope,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/healthcare_text_classifier_agent";

export default function HealthcareAppointmentClassifier() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  function parseResults(rawData) {
    return (Array.isArray(rawData) ? rawData : []).map((item, idx) => {
      let parsed = {};
      try {
        const clean = item.classification.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        console.error("Failed to parse classification JSON");
      }
      return {
        request_id: idx + 1,
        request_text: item.message,
        detected_type: parsed.category || "Unknown",
        urgency_level: parsed.urgency || "N/A",
        assigned_department: parsed.assigned_department || "N/A",
        confidence: parsed.confidence || 70,
        status: "Pending",
        keywords: parsed.keywords || [],
      };
    });
  }

  const classifyManual = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [text] }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || "Classification failed");
      setResults(parseResults(data));
    } catch (e) {
      alert(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const classifyFile = async (file) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const resp = await fetch(`${API_BASE}/classify_file`, {
        method: "POST",
        body: form,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || "File classification failed");
      setResults(parseResults(data));
    } catch (e) {
      alert(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (u) => {
    switch (u?.toLowerCase()) {
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

  const getStatusIcon = (status) =>
    status?.toLowerCase().includes("completed") ||
      status?.toLowerCase().includes("processed") ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <Clock className="w-4 h-4 text-blue-600" />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F6FE] via-white to-[#F2F6FE] py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#064EE3] to-[#3D76EC] bg-clip-text text-transparent">
            Healthcare Appointment Classifier
          </h1>
          <p className="mt-2 text-gray-600">
            AI-powered categorization of patient appointment requests
          </p>
        </div>

        {/* Input Panels */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Manual Input */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#064EE3]" />
              <h2 className="text-xl font-semibold text-gray-800">
                Manual Classification
              </h2>
            </div>
            <textarea
              className="w-full border rounded-2xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-[#3D76EC] focus:border-transparent shadow-sm"
              placeholder="e.g., Need urgent blood test for diabetes screening..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={classifyManual}
              disabled={loading || !text.trim()}
              className="mt-4 w-full bg-gradient-to-r from-[#064EE3] to-[#3D76EC] text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Classifying..." : "Classify Request"}
            </button>
          </div>

          {/* Bulk Upload */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Bulk Classification
              </h2>
            </div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                Click to upload or drag & drop
              </p>
              <span className="text-sm text-gray-500 mt-1">
                Supports CSV, XLSX, JSON
              </span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && classifyFile(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Classification Results
            </h2>
            {results.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {results.length} {results.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results yet</p>
              <p className="text-gray-400 text-sm">
                Enter text or upload a file to begin
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[
                      "ID",
                      "Type",
                      "Urgency",
                      "Department",
                      "Confidence",
                      "Status",
                      "Keywords",
                      "Request Text",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={r.request_id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? "bg-gray-25" : "bg-white"
                        }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs">{r.request_id}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
                          <User className="w-3 h-3" />
                          {r.detected_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getUrgencyColor(
                            r.urgency_level
                          )}`}
                        >
                          <AlertCircle className="w-3 h-3" />
                          {r.urgency_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{r.assigned_department}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                              style={{ width: `${r.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {r.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-1">
                        {getStatusIcon(r.status)}
                        <span className="text-xs">{r.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {r.keywords.slice(0, 3).map((k, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border"
                            >
                              {k}
                            </span>
                          ))}
                          {r.keywords.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{r.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs break-words">
                        {r.request_text.length > 80
                          ? `${r.request_text.slice(0, 80)}…`
                          : r.request_text}
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
  );
}
