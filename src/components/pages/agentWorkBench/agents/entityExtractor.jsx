
import { useState } from "react";
import { ArrowLeft } from 'lucide-react';

export default function EntityExtractor() {
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [entities, setEntities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (rawText.trim()) formData.append("raw_text", rawText);
    formData.append("entity_types", "Person,Date,Organization,Location,Money");
    formData.append("confidence_threshold", "0.7");
    formData.append("export_format", "json");

    try {
      const response = await fetch("http://localhost:8000/entity_extractor/extract", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setEntities(data.entities || []);
      setSummary(data);
    } catch (err) {
      console.error("Error extracting entities:", err);
    }
    setLoading(false);
  };

  const exportData = (format) => {
    let content;
    const header = "Entity Type,Entity Value,Confidence\n";
    const rows = entities
      .map(
        (e) =>
          `${e.entity_type},${e.entity_value},${(e.confidence * 100).toFixed(1)}%`
      )
      .join("\n");

    if (format === "csv") {
      content = header + rows;
      downloadFile(content, "entities.csv", "text/csv");
    } else if (format === "json") {
      content = JSON.stringify(entities, null, 2);
      downloadFile(content, "entities.json", "application/json");
    } else if (format === "excel") {
      const header = "Entity Type,Entity Value,Confidence\n";
      const rows = entities
        .map(
          (e) =>
            `${e.entity_type},${e.entity_value},${(e.confidence * 100).toFixed(1)}%`
        )
        .join("\n");
      content = header + rows;
      downloadFile(content, "entities.xlsx", "application/vnd.ms-excel");
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filteredEntities =
    filter === "all" ? entities : entities.filter((e) => e.entity_type === filter);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-3" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="relative">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center mb-6 p-3 sm:p-4 rounded-lg mx-8 sm:mx-12 lg:mx-0" style={{ backgroundColor: '#1E3A8A', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Entity Extraction Tool
          </h1>
          <button
            onClick={() => window.location.href = '/media-entertainment'}
            className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-4 lg:right-4 flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-200 transition-colors text-sm sm:text-base p-2 hover:bg-white-50 hover:bg-opacity-10 rounded-md"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mb-3 text-gray-700">
          <p className="mb-2">Extract entities (e.g., Person, Date) from text or files.</p>
          <p className="text-sm">Supported formats: .txt, .pdf, .doc, .docx</p>
        </div>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows={4}
            placeholder="Enter your text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-6 cursor-pointer hover:border-blue-600 transition"
            >
              <svg
                className="w-8 h-8 text-blue-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V8a4 4 0 018 0v8m-4 4v-4m0 0H7m4 0h4"
                />
              </svg>
              <span className="text-blue-600 font-medium">Click to upload or drag & drop</span>
              <span className="text-gray-500 text-sm mt-1">Supported formats: .txt, .pdf, .doc, .docx</span>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {file && (
              <div className="mt-2 text-sm text-gray-700">
                Selected file: <span className="font-semibold">{file.name}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !rawText.trim())}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${loading || (!file && !rawText.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
            style={{ backgroundColor: loading || (!file && !rawText.trim()) ? '#9CA3AF' : '#1E3A8A' }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Processing...
              </span>
            ) : 'Extract Entities'}
          </button>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Response Summary</h2>
            {summary.total_entities !== undefined && (
              <p className="text-gray-700"><strong>Total Entities:</strong> {summary.total_entities}</p>
            )}
            {summary.entities_by_type && (
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.entries(summary.entities_by_type).map(([type, count]) => (
                  <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                    {type}: {String(count)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Entities Found */}
        {entities.length === 0 && summary?.status === "no_entities_found" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">No Entities Found</h3>
            <p className="text-gray-700">{summary.message}</p>
            <div className="mt-2 text-sm text-gray-700">
              <strong>Text length:</strong> {summary.text_length}
              <br />
              <strong>Entity types searched:</strong> {summary.entity_types_searched?.join(", ")}
            </div>
          </div>
        )}

        {/* Filters and Export Buttons */}
        {entities.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 flex justify-between items-center">
            <select
              className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              {[...new Set(entities.map((e) => e.entity_type))].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="space-x-2">
              <button
                onClick={() => exportData("csv")}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportData("excel")}
                className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition"
              >
                Export Excel
              </button>
              <button
                onClick={() => exportData("json")}
                className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition"
              >
                Export JSON
              </button>
            </div>
          </div>
        )}

        {/* Results Table */}
        {filteredEntities.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-gray-800">Entity Type</th>
                  <th className="border p-2 text-gray-800">Entity Value</th>
                  <th className="border p-2 text-gray-800">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map((entity, idx) => (
                  <tr
                    key={idx}
                    className={entity.confidence < 0.7 ? "bg-red-100" : "bg-white"}
                  >
                    <td className="border p-2 text-gray-700">{entity.entity_type}</td>
                    <td className="border p-2 text-gray-700">{entity.entity_value}</td>
                    <td className="border p-2 text-gray-700">
                      {(entity.confidence * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}