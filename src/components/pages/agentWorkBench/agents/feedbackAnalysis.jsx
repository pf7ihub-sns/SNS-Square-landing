import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

function FeedbackAnalysis() {
  const [file, setFile] = useState(null);
  const [textFeedback, setTextFeedback] = useState("");
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !textFeedback.trim()) {
      setError("Please provide either a file or text feedback");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (textFeedback.trim()) {
      formData.append("text_feedback", textFeedback);
    }
    if (instruction.trim()) {
      formData.append("instruction", instruction);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/feedback/generate-feedback", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error generating feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.success) {
      const csvContent = [result.columns.join(",")].concat(result.rows.map(row => row.join(","))).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "structured_feedback.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-3xl w-full p-4 mt-15">
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Feedback Analysis
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
        <div className="mb-6 text-center">
          <p className="text-gray-800 mb-2">Analyze survey feedback and generate structured insights.</p>
          <p className="text-gray-600 text-sm">Upload a file or enter text feedback to categorize and summarize responses.</p>
        </div>

        {/* Input Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-800 font-medium mb-2">
            Upload Feedback File (CSV/TXT) or Enter Text
          </label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          {file && (
            <p className="text-sm text-gray-600 mb-2">Selected: {file.name}</p>
          )}
          <textarea
            value={textFeedback}
            onChange={(e) => setTextFeedback(e.target.value)}
            placeholder="Or paste feedback text here..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <label className="block text-gray-800 font-medium mb-2">
            Instructions (optional)
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="E.g., Categorize into Product, Service, General; Mark actionable items..."
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !textFeedback.trim())}
            className={`w-full py-1.5 px-3 rounded-md text-white font-medium transition-colors mt-2 ${loading || (!file && !textFeedback.trim())
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800'
              }`}
            style={{ backgroundColor: loading || (!file && !textFeedback.trim()) ? '#9CA3AF' : '#1E3A8A' }}
          >
            {loading ? 'Analyzing...' : 'Generate Feedback'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm border border-gray-200">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && result.success && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Structured Feedback
            </h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleDownload}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-1.5 px-3 rounded-md transition-colors"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                Download CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    {result.columns.map((col, index) => (
                      <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackAnalysis;