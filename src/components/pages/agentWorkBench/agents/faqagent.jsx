
import { useState } from "react";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

function InputSourceCard() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [minClusterSize, setMinClusterSize] = useState(3);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.6);
  const [enableRefinement, setEnableRefinement] = useState(true);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (selectedFile.size > maxSize) {
        setError("File size exceeds 10MB limit. Please choose a smaller file.");
        return;
      }

      setFile(selectedFile);
      setTextInput("");
      setError(null);
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    if (e.target.value.trim()) {
      setFile(null);
    }
  };

  const resetForm = () => {
    setTextInput("");
    setFile(null);
    setResult(null);
    setError(null);
    setMinClusterSize(3);
    setConfidenceThreshold(0.6);
    setEnableRefinement(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textInput.trim() && !file) {
      setError("Please provide either text input or select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('action', 'generate');
      formData.append('min_cluster_size', minClusterSize.toString());
      formData.append('confidence_threshold', confidenceThreshold.toString());
      formData.append('enable_refinement', enableRefinement.toString());

      if (textInput.trim()) {
        formData.append("content", textInput);
      } else if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/faq_agent/faq",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 120000,
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("FAQ generation error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "An error occurred while generating FAQs"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-5xl mt-22">
        {/* Header */}
        <div className="relative">
          <h1 className="text-3xl font-semibold text-white text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            FAQ Generator
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
        <div className="text-center mb-6 text-gray-700">
          <p className="mb-2">Generate FAQs from text or uploaded files (TXT, PDF, DOCX, CSV, JSON – max 10MB).</p>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Active Agent Badge */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full mb-6">
            Active Agent
          </span>
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Upload
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-25 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-blue-600 font-medium">Choose a file</span>
              <span className="text-sm text-gray-500">
                or drag and drop (TXT, PDF, DOCX, CSV, JSON – max 10MB)
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.pdf,.docx,.csv,.json"
              />
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <span className="font-semibold">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              style={{ backgroundColor: loading ? '#9CA3AF' : '#1E3A8A' }}
            >
              {loading ? 'Generating FAQs...' : 'Generate FAQs'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Result Section */}
        {loading && <p className="text-center mt-4">Generating FAQs...</p>}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Generated FAQs</h3>
            </div>
            <div className="px-6 py-4 h-96 overflow-y-auto">
              {result.status === 'error' && result.message && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">Error: {result.message}</p>
                </div>
              )}

              {result.summary && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Processing Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Documents:</span> {result.summary.total_documents}
                    </div>
                    <div>
                      <span className="font-medium">Segments:</span> {result.summary.total_segments}
                    </div>
                    <div>
                      <span className="font-medium">Clusters:</span> {result.summary.clusters_formed}
                    </div>
                    <div>
                      <span className="font-medium">FAQs:</span> {result.summary.faqs_generated}
                    </div>
                    <div className="col-span-2 md:col-span-4">
                      <span className="font-medium">Processing Time:</span> {result.summary.processing_time_seconds?.toFixed(2)}s
                    </div>
                    {result.summary.warnings && result.summary.warnings.length > 0 && (
                      <div className="col-span-2 md:col-span-4">
                        <span className="font-medium text-yellow-700">Warnings:</span>
                        <ul className="list-disc list-inside text-yellow-700 mt-1">
                          {result.summary.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.faqs && result.faqs.length > 0 ? (
                <div className="space-y-4">
                  {result.faqs.map((faq, index) => (
                    <div key={faq.id || index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-blue-700 mb-2">Q: {faq.question}</h4>
                      <p className="text-gray-700 mb-2">A: {faq.answer}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Confidence: {(faq.confidence * 100)?.toFixed(1)}%</span>
                        {faq.cluster_id && <span>Cluster: {faq.cluster_id}</span>}
                        {faq.source_references && faq.source_references.length > 0 && (
                          <span>Sources: {faq.source_references.join(', ')}</span>
                        )}
                      </div>
                      {faq.metadata && Object.keys(faq.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          Metadata: {JSON.stringify(faq.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : result.status === 'success' && (
                <div className="text-center py-8 text-gray-500">
                  <p>No FAQs were generated from the provided content.</p>
                  <p className="text-sm mt-2">Try providing more detailed content or check the processing summary above.</p>
                </div>
              )}

              {result.message && result.status === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{result.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputSourceCard;
